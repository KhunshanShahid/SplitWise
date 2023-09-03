/* eslint-disable no-useless-catch */
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
  } from "firebase/auth";
  import {
      collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
  } from "firebase/firestore";
  import { auth, database } from "../src/Firebase/firebase";
  export const createFirebaseUser = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      return res.user;
    } catch (error) {
      throw error;
    }
  };

  export const updateFirebaseUserProfile = async (user, displayName) => {
    try {
      await updateProfile(user, { displayName });
    } catch (error) {
      throw error;
    }
  };
  
  export const setFirebaseUserData = async (userId, name, email) => {
    try {
      const userDocRef = doc(database, "users", userId);
      await setDoc(userDocRef, { id: userId, name, email });
    } catch (error) {
      throw error;
    }
  };
  
  export const getFirebaseDocuments = async (queryFn) => {
    try {
      const queryResult = await getDocs(queryFn);
      return queryResult;
    } catch (error) {
      throw error;
    }
  };
  
  export const signInWithFirebaseEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };
  export const fetchUserExpenses = async (user) => {
    try {
      const ExpenseCollection = collection(database, "expense");
      const ref = await getDocs(ExpenseCollection);
      const allExpenses = ref.docs.map((doc) => doc.data());
      const userExpenses = allExpenses.filter((expense) => {
        return (
          expense.owed &&
          expense.owed[expense.id] &&
          expense.owed[expense.id].some(
            (participant) =>
              participant.debtor === user || participant.creditor === user
          )
        );
      });
      return userExpenses;
    } catch (error) {
      throw error;
    }
  };
  export const deleteExpenseItem = async (expenseId, idToDelete) => {
    try {
      const expenseRef = doc(database, "expense", expenseId);
      const expenseSnapshot = await getDoc(expenseRef);
      const expenseData = expenseSnapshot.data();

      const updatedOwedData = {
        ...expenseData.owed,
        [expenseId]: expenseData.owed[expenseId].filter(
          (item) => item.id !== idToDelete
        ),
      };
  
      const updatedExpenseData = {
        ...expenseData,
        owed: updatedOwedData,
      };
      await setDoc(expenseRef, updatedExpenseData);
  
      return updatedExpenseData;
    } catch (error) {
      throw error;
    }
  };

  export const fetchUserExpenseDetails = async (user) => {
    try {
      const q = collection(database, "expense");
      const ref = await getDocs(q);
      const allExpenses = ref.docs.map((doc) => doc.data());
      const filteredExpense = allExpenses.filter((expense) => {
        const hasOwedData = expense.owed?.[expense.id]?.some(
          (participant) => participant.debtor === user
        );
        const hasParticipantsData = expense.participants?.some(
          (participant) => participant.label === user
        );
        return hasOwedData || hasParticipantsData;
      });
      return filteredExpense;
    } catch (error) {
      throw error;
    }
  };