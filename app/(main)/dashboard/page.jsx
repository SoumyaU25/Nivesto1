import React from 'react'
import { getUserAccount } from '@/actions/dashboard'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import AccountCard from './_components/account-card'
import { BudgetProgress } from "./_components/budget-progress";
import { getCurrentBudget } from '@/actions/budget'
import { getDashboardData } from '@/actions/dashboard'
import DashboardOverview from './_components/transaction-overview'
import { Suspense } from 'react'


async function Dashboard() {
  const accounts = await getUserAccount();

  const defaultAccount = accounts?.find((account) => account.isDefault);
  const transactions = await getDashboardData();

   // Get budget for default account
   let budgetData = null;
   if (defaultAccount) {
     budgetData = await getCurrentBudget(defaultAccount.id);
   }
  
  return (
    <div className='px-5 space-y-6'>
        {/* Budget Progress*/}
        <BudgetProgress 
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

        {/* Overview */}
        <Suspense fallback={"Loading Overview..."}>
          <DashboardOverview
            accounts = {accounts}
            transactions = {transactions || []}
          />

        </Suspense>


        {/* Accounts Grid */}
        <div className='space-y-4'>
          <CreateAccountDrawer>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
              <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                <Plus className="h-10 w-10 mb-2"/>
                <p className="text-sm font-medium">Add New Account</p>
              </CardContent>
            </Card>
          </CreateAccountDrawer>
          {accounts.length>0 && accounts?.map((account)=>{
             return <AccountCard key ={account.id} account = {account}/>
          })}
        </div>

    </div>
  )
}

export default Dashboard
