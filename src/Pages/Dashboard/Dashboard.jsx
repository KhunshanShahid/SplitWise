import styles from "./Dashboard.module.css";
import Select from "react-select";
import Modal from "react-modal";
import uuid from "react-uuid";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, database, storage } from "../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { MultiSelect } from "react-multi-select-component";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Bars } from "react-loader-spinner";

const Dashboard = () => {
  const [friend, setFriend] = useState([]);
  const [user, setUser] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [splitEqual, setSplitEqual] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFriendsUnEqual, setSelectedFriendsUnEqual] = useState([]);
  const [currUser, setCurrUser] = useState({
    order: "",
    paid: "",
  });
  const [paidByFriend, setPaidByFriend] = useState({});
  const [billImage, setBillImage] = useState();
  const [equalExpenseHandle, setEqualExpenseHandle] = useState({
    date: "",
    desc: "",
    totalAmount: "",
  });
  const [splitUnEqualData, setSplitUnEqualData] = useState({
    date: "",
    description: "",
    totalAmount: "",
  });
  const [splitUnEqual, setSplitUnEqual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFriends(user.uid);
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchFriends = async (userId) => {
    const q = query(collection(database, "users", userId, "friends"));
    try {
      const querySnapshot = await getDocs(q);
      const newFriends = querySnapshot.docs.map((doc) => doc.data());
      setFriend(newFriends);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching friends data:", error);
      setLoading(false);
    }
  };

  const handleInputChangeUnEqual = (e) => {
    const { name, value } = e.target;
    setSplitUnEqualData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const splitEqualExpense = async (e) => {
    e.preventDefault();
    if (
      !equalExpenseHandle.desc ||
      !equalExpenseHandle.totalAmount ||
      !paidByFriend ||
      !selectedFriends ||
      !billImage ||
      !equalExpenseHandle.date
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setBtnLoading(true);
    const updatedDebtData = [];
    const calculatedOwe = {};
    const contributors = [
      ...selectedFriends,
      {
        value: user.email,
        label: user.displayName,
        id: user.uid,
      },
    ];
    const oweID = "owe_id_" + uuid();
    const totalcontributors = contributors.length;
    const amountDistributed =
      equalExpenseHandle.totalAmount / totalcontributors;
    contributors.forEach((contributor) => {
      if (contributor.id !== paidByFriend.id) {
        updatedDebtData.push({
          id: oweID,
          amount: amountDistributed,
          debtor: contributor.label,
          creditor: paidByFriend.label,
        });
      }
    });
    const imageRef = ref(storage, `images/${billImage.name}`);
    await uploadBytes(imageRef, billImage);
    const imageURL = await getDownloadURL(imageRef);
    const customId = "custom_id_" + uuid();
    calculatedOwe[customId] = updatedDebtData;
    const expenseEqual = {
      creator: user.displayName,
      id: customId,
      description: equalExpenseHandle.desc,
      totalAmount: equalExpenseHandle.totalAmount,
      paidBy: paidByFriend,
      participants: contributors,
      owed: calculatedOwe,
      image: imageURL,
    };
    try {
      const userDocRef = doc(database, "expense", customId);
      await setDoc(userDocRef, expenseEqual);
      toast.success("Expense Created");
      setEqualExpenseHandle({
        date: "",
        desc: "",
        totalAmount: "",
      });
      setPaidByFriend([]);
      setSelectedFriends([]);
      setBillImage(null);
    } catch (dbErr) {
      toast.error("Error Adding Expense, Try Again");
      return;
    } finally {
      setBtnLoading(false);
    }
  };

  const equalExpenseData = (e) => {
    setEqualExpenseHandle((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const splitUnEqualExpense = async (e) => {
    e.preventDefault();
    if (
      !splitUnEqualData.description ||
      !splitUnEqualData.totalAmount ||
      !selectedFriendsUnEqual ||
      !billImage ||
      !splitUnEqualData.date ||
      splitUnEqualData.totalAmount < 0 ||
      selectedFriendsUnEqual.some(
        (friend) => friend.order < 0 || friend.paid < 0
      )
    ) {
      toast.error(
        "Please fill in all required fields and ensure no negative values."
      );
      return;
    }
    const customId = "custom_id_" + uuid();
    const mySelectedData = [...selectedFriendsUnEqual, currUser];
    const calculatedOwe = {};
    const expense = [
      {
        creator: user.displayName,
        description: splitUnEqualData.description,
        Amount: splitUnEqualData.totalAmount,
        owed: mySelectedData,
      },
    ];
    let totalOrder = 0;
    let totalPaid = 0;
    mySelectedData.forEach((contributor) => {
      const order = parseInt(contributor.order);
      const paid = parseInt(contributor.paid);

      if (!isNaN(order)) {
        totalOrder += order;
      }

      if (!isNaN(paid)) {
        totalPaid += paid;
      }
    });
    const totalOrderRounded = Math.round(totalOrder);
    const totalPaidRounded = Math.round(totalPaid);
    const totalAmountRounded = Math.round(splitUnEqualData.totalAmount);
    if (
      totalOrderRounded !== totalAmountRounded ||
      totalPaidRounded !== totalAmountRounded
    ) {
      toast.error(
        "Total order and total paid amounts must equal the total amount."
      );
      return;
    }
    expense.forEach((expenseItem) => {
      const contributors = expenseItem.owed;
      contributors.forEach((contributor) => {
        const order = parseInt(contributor.order);
        const paid = parseInt(contributor.paid);

        if (!isNaN(order) && !isNaN(paid)) {
          contributor.owed = order - paid;
        } else {
          contributor.owed = 0;
        }
      });
      setBtnLoading(true);
      const oweID = "OweID" + uuid();
      const oweDetails = [];
      contributors.forEach((contributor) => {
        contributors.forEach((creditor) => {
          if (contributor.owed < 0 && creditor.owed > 0) {
            const amountToTransfer = Math.min(-contributor.owed, creditor.owed);
            creditor.owed -= amountToTransfer;
            contributor.owed += amountToTransfer;
            oweDetails.push({
              id: oweID,
              debtor: creditor.label,
              creditor: contributor.label,
              amount: amountToTransfer,
            });
            if (contributor.owed === 0) {
              return;
            }
          }
        });
      });
      calculatedOwe[customId] = oweDetails;
    });
    try {
      const imageRef = ref(storage, `images/${billImage.name}`);
      await uploadBytes(imageRef, billImage);
      const imageURL = await getDownloadURL(imageRef);
      const expenseData = {
        id: customId,
        creator: user.displayName,
        date: splitUnEqualData.date,
        description: splitUnEqualData.description,
        totalAmount: splitUnEqualData.totalAmount,
        participants: mySelectedData,
        owed: calculatedOwe,
        image: imageURL,
      };
      const userDocRef = doc(database, "expense", customId);
      await setDoc(userDocRef, expenseData);
      toast.success("Expense is created successfully");
      setSelectedFriendsUnEqual((prevSelectedFriends) =>
        prevSelectedFriends.map((friend) => ({
          ...friend,
          order: "",
          paid: "",
        }))
      );
      setSplitUnEqualData({
        date: "",
        description: "",
        totalAmount: "",
      });
      setBillImage(null);
    } catch (firestoreError) {
      toast.error("Failed to Add Expense. Try Again");
      return;
    } finally {
      setBtnLoading(false);
    }
  };

  const findFriend = async () => {
    const currentUserEmail = auth.currentUser.email;
    if (friendEmail === currentUserEmail) {
      toast.warning("You cannot add yourself as a friend.");
      return;
    }
    const isFriendAlreadyAdded = friend.some(
      (friendData) => friendData.email === friendEmail
    );
    if (isFriendAlreadyAdded) {
      toast.warning("This friend is already added.");
      return;
    }
    const checkEmail = query(
      collection(database, "users"),
      where("email", "==", friendEmail)
    );
    const getFriendsdata = await getDocs(checkEmail);
    if (!getFriendsdata.empty) {
      const addFriendData = getFriendsdata.docs[0].data();
      if (addFriendData) {
        const currentUserId = auth.currentUser.uid;
        const friendDbData = doc(
          database,
          "users",
          currentUserId,
          "friends",
          addFriendData.id
        );
        try {
          await setDoc(friendDbData, addFriendData);
          setFriend((prevFriends) => [...prevFriends, addFriendData]);
          toast.success("Friend added successfully!");
          setFriendEmail("");
        } catch (error) {
          toast.error("Error adding friend:", error);
        }
      }
    } else {
      toast.warning("No friend data found for the given email.");
    }
  };

  const handlePaidChange = (friendId, paid) => {
    setSelectedFriendsUnEqual((prevSelectedFriends) =>
      prevSelectedFriends.map((friend) => {
        if (friend.id === friendId) {
          return {
            ...friend,
            paid: paid,
          };
        }
        return friend;
      })
    );
  };

  const handleOrderChange = (friendId, order) => {
    setSelectedFriendsUnEqual((prevSelectedFriends) =>
      prevSelectedFriends.map((friend) => {
        if (friend.id === friendId) {
          return {
            ...friend,
            order: order,
          };
        }
        return friend;
      })
    );
  };

  const handleInputChange = (property, value) => {
    setCurrUser((prevUser) => ({
      ...prevUser,
      [property]: value,
      value: user.email,
      label: user.displayName,
      id: user.uid,
    }));
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.leftBar}>
          <h3>Friends</h3>
          <input
            type="email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="Add Friend(Email)"
          />
          <button onClick={findFriend}>Add</button>
          <p>
            {loading ? (
              <Bars
                height="80"
                width="60"
                color="blue"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass="d-flex justify-content-center align-items-center"
                visible={true}
              />
            ) : (
              <>
                {friend && friend.length > 0 ? (
                  friend.map((friendData) => (
                    <div key={friendData.id} className={styles.listFriends}>
                      {friendData.name}
                    </div>
                  ))
                ) : (
                  <h4>No Friends Added</h4>
                )}
              </>
            )}
          </p>
        </div>
        <div className={styles.rightBar}>
          <>
            <Modal
              isOpen={splitEqual}
              onRequestClose={() => setSplitEqual(false)}
              contentLabel="Logout Confirmation"
              className={styles.customModal}
              overlayClassName={styles.customOverlay}
            >
              <div className={styles.main1}>
                <h2>Equal Expense</h2>
                <form className={styles.formStyle1}>
                  <div className={styles.multiSelectContainer}>
                    <h2>Select Friends</h2>
                    <MultiSelect
                      options={friend.map((user) => ({
                        value: user.email,
                        label: user.name,
                        id: user.id,
                      }))}
                      value={selectedFriends}
                      onChange={setSelectedFriends}
                      className={styles.customMultiSelect}
                    />
                    <p className={styles.selectedUsersText}>
                      Selected Users:{" "}
                      {selectedFriends.map((user) => user.label).join(", ")}
                    </p>
                  </div>
                  <p>Paid By</p>
                  <Select
                    options={[
                      ...selectedFriends.map((selectFriend) => ({
                        value: selectFriend.value,
                        label: selectFriend.label,
                        id: selectFriend.id,
                      })),
                      {
                        value: user.email,
                        label: user.displayName,
                        id: user.uid,
                      },
                    ]}
                    value={paidByFriend}
                    onChange={setPaidByFriend}
                    className={styles.Select}
                  />
                  <div className="text-white"> Description</div>{" "}
                  <input
                    type="text"
                    onChange={equalExpenseData}
                    name="desc"
                    value={equalExpenseHandle.desc}
                    placeholder="Description"
                    className="w-75"
                  />
                  <div className="text-white"> Date</div>{" "}
                  <input
                    type="date"
                    onChange={equalExpenseData}
                    name="date"
                    value={equalExpenseHandle.date}
                    className="w-75"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <div className="text-white"> Total Amount</div>{" "}
                  <input
                    type="number"
                    onChange={equalExpenseData}
                    name="totalAmount"
                    value={equalExpenseHandle.totalAmount}
                    placeholder="Enter Amount"
                    className="w-75"
                  />
                  <div className="text-white"> Image</div>{" "}
                  <input
                    type="file"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                        if (allowedTypes.includes(selectedFile.type)) {
                          setBillImage(selectedFile);
                        } else {
                          toast.warning("Please select a PNG, JPG, or JPEG file.");
                          e.target.value = null;
                        }
                      }
                    }}
                    accept=".png, .jpg, .jpeg"
                    name="img"
                    className="w-75"
                  />
                  {btnLoading ? (
                    <>
                      <Bars
                        height="50"
                        width="40"
                        color="blue"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass="d-flex justify-content-center p-3"
                        visible={true}
                      />
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        onClick={splitEqualExpense}
                        className={`${styles.submitBtn} p-2 m-2`}
                      >
                        Split Equaly
                      </button>
                    </>
                  )}
                </form>
                <div>
                  Want to Split{" "}
                  <span
                    className={`text-primary text-decoration-underline`}
                    onClick={() => setSplitUnEqual(true)}
                  >
                    {" "}
                    UnEqually or Divide
                  </span>
                </div>
              </div>
            </Modal>
            <Modal
              isOpen={splitUnEqual}
              onRequestClose={() => setSplitUnEqual(false)}
              contentLabel="Logout Confirmation"
              className={styles.customModal}
              overlayClassName={styles.customOverlay}
            >
              <div className={styles.main1}>
                <h2>Divide Expense</h2>
                <form
                  onSubmit={splitUnEqualExpense}
                  className={`${styles.formStyle}`}
                >
                  <div className="table-responsive-lg">
                    <table
                      className={`${styles.inputTable} table text-white table-borderless w-75`}
                    >
                      <tbody>
                        <tr>
                          <td>Date</td>
                          <td>
                            <input
                              type="date"
                              name="date"
                              value={splitUnEqualData.date}
                              onChange={handleInputChangeUnEqual}
                              className="w-75"
                              max={new Date().toISOString().split("T")[0]}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Description</td>
                          <td>
                            <input
                              type="text"
                              name="description"
                              value={splitUnEqualData.description}
                              onChange={handleInputChangeUnEqual}
                              placeholder="Description"
                              className="w-75"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Total Amount</td>
                          <td>
                            <input
                              type="number"
                              name="totalAmount"
                              value={splitUnEqualData.totalAmount}
                              onChange={handleInputChangeUnEqual}
                              className="w-75"
                            />
                          </td>
                        </tr>
                        <tr className="w-50 mb-5 p-4">
                          <td>Image</td>
                          <td>
                            <input
                              type="file"
                              onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (selectedFile) {
                                  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
                                  if (allowedTypes.includes(selectedFile.type)) {
                                    setBillImage(selectedFile);
                                  } else {
                                    toast.warning("Please select a PNG, JPG, or JPEG file.");
                                    e.target.value = null;
                                  }
                                }
                              }}
                              name="img"
                              accept=".png, .jpg, .jpeg"
                              className="w-75"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Selected Users</td>
                          <td>
                            <MultiSelect
                              options={friend.map((user) => ({
                                value: user.email,
                                label: user.name,
                                id: user.id,
                              }))}
                              value={selectedFriendsUnEqual}
                              onChange={setSelectedFriendsUnEqual}
                              className={styles.customMultiSelect}
                            />
                            <p>
                              Selected Users:{" "}
                              {selectedFriendsUnEqual
                                .map((user) => user.label)
                                .join(", ")}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td>{user.displayName}</td>
                          <td>
                            <div className={styles.orderAmount}>
                              <div className="d-flex justify-content-around">
                                <p>Order</p>
                                <input
                                  type="number"
                                  value={currUser.order}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "order",
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </div>
                              <div className="d-flex justify-content-around">
                                <p>Paid</p>
                                <input
                                  type="number"
                                  value={currUser.paid}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "paid",
                                      parseInt(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                        {selectedFriendsUnEqual.map((user) => (
                          <tr key={user.id}>
                            <td>{user.label}</td>
                            <td>
                              <div className={styles.orderAmount}>
                                <div className="d-flex justify-content-around">
                                  <p>Order</p>
                                  <input
                                    type="number"
                                    name={`order-${user.id}`}
                                    value={user.order}
                                    onChange={(e) =>
                                      handleOrderChange(
                                        user.id,
                                        Math.max(parseInt(e.target.value), 0)
                                      )
                                    }
                                  />
                                </div>
                                <div className="d-flex justify-content-around">
                                  <p>Paid</p>
                                  <input
                                    type="number"
                                    name={`paid-${user.id}`}
                                    value={user.paid}
                                    onChange={(e) =>
                                      handlePaidChange(
                                        user.id,
                                        Math.max(parseInt(e.target.value), 0)
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {btnLoading ? (
                    <>
                      <Bars
                        height="50"
                        width="40"
                        color="blue"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass="d-flex justify-content-center p-3"
                        visible={true}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="submit"
                        value="Split UnEqually"
                        className={styles.submitBtn}
                      />
                    </>
                  )}
                </form>
                <div>
                  Want to Split{" "}
                  <span
                    className={`text-primary text-decoration-underline`}
                    onClick={() => {
                      setSplitEqual(true);
                      setSplitUnEqual(false);
                    }}
                  >
                    {" "}
                    Equally
                  </span>
                </div>
              </div>
            </Modal>
          </>
          <>
            <h3
              onClick={() => {
                setSplitEqual(true);
              }}
              className="bg-primary p-4 cursor-zoom-in"
            >
              Add Expense
            </h3>
            <h4>Create Expense With your Friends with BillBuddy</h4>
          </>
        </div>
      </div>
    </>
  );
};

export default Dashboard;