"use client"

import React, { useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { toast } from "sonner";

import Link from "next/link";

import { Switch } from "@/components/ui/switch";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { updateDefaultAccount } from "@/actions/accounts";  //function 
import useFetch from "@/hooks/use-fetch";        //function

const AccountCard = ({account}) => {
    const {name, type, balance, id, isDefault} = account;

    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error, 
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async(event)=>{
        event.preventDefault();

        if(isDefault){
            toast.warning("You need atleast 1 default account");
            return;
        }

        await updateDefaultFn(id);
    }
    useEffect(()=>{
        if(updatedAccount?.success && !updateDefaultLoading){
            toast.success("Default account updated successfully")
        }
    },[updatedAccount, updateDefaultLoading]);

    useEffect(()=>{
        if(error){
            toast.error(error.message||"Failed to update default account");
        }
    }, [error])

  return (
    <div className="flex flex-col mb-4">
      <Card className="hover:shadow-md transaction-shadow group relative">
        <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize text-white">{name}</CardTitle>
          <Switch checked={isDefault} 
          onClick = {handleDefaultChange}
          disabled = {updateDefaultLoading}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-200">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {type}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500"/>
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500"/>
          </div>
        </CardFooter>
        </Link>
      </Card>
    </div>
  );
};

export default AccountCard;
