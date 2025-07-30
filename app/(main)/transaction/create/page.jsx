import React from 'react'
import { getUserAccount } from '@/actions/dashboard';
import { defaultCategories } from '@/data/categories';
import AddTransactionForm from '../_components/transaction-form';
import { getTransaction } from '@/actions/transaction';

const AddTransactionPage = async({searchParams}) => {

  const accounts = await getUserAccount();
  const editId = await searchParams?.edit;

  let initialData = null;
  if(editId){
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }
  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl gradient-title mb-8'>Add Transaction</h1>

      <AddTransactionForm 
      accounts = {accounts} 
      categories={defaultCategories}
      editMode={!!editId}
      initialData={initialData}
      />
    </div>
  )
}

export default AddTransactionPage;
