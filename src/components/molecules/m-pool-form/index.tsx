"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";

import { Input } from "@ui/input";
import AssetSelectCombobox from "../m-asset-select-combobox";
import { Button } from "@/components/ui/button";
import { useNewPoolMutation } from "@/services/graphql/generated";
import React from "react";
import { useWallet } from "@txnlab/use-wallet";
import { useToast } from "@/components/ui/use-toast";
import { PoolFormSchema, usePoolForm } from "./schema";
import { useContractClients } from "@/components/providers/contract";
import algosdk from "algosdk";
import { ellipseAddress } from "@/lib/utils/text";
import { getMultiplierForDecimalPlaces } from "@/lib/utils/math";
import { TooltipInfo } from "@/components/atoms/a-tooltip-info/index";
import Dropzone from "@ui/dropzonde";

interface Props {
  onClose?: CallableFunction;
}

const PoolForm: React.FC<Props> = ({ onClose }) => {
  const form = usePoolForm();
  const { activeAddress } = useWallet();
  const [{ fetching }, mutate] = useNewPoolMutation();
  const [assetDecimals, setAssetDecimals] = React.useState(1);
  const [contractLoading, setContractLoading] = React.useState(false);
  const { loanClient, algodClient, authAndDaoClient } = useContractClients();

  const { toast } = useToast();

  const onSubmit = async (value: PoolFormSchema) => {
    if (!activeAddress) {
      toast({
        title: "Unidentified User",
        description: "Please connect your wallet to proceed",
        variant: "destructive",
      });
      onClose && onClose();
      return;
    }

    setContractLoading(true);
    const loanAppRef = await loanClient.appClient.getAppReference();
    const sp = await algodClient.getTransactionParams().do();

    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      to: loanAppRef.appAddress,
      from: activeAddress,
      assetIndex: value.assetId,
      amount:
        Number(value.fundAmount) * getMultiplierForDecimalPlaces(assetDecimals),
      suggestedParams: sp,
    });

    try {
      const res = await authAndDaoClient.authorizePoolCreation({
        txn,
        folksFeedOracle: Number(
          process.env.NEXT_PUBLIC_FOLKS_FEED_ORACLE_APP_ID,
        ),
      });

      if (!res.return) {
        toast({
          title: "Contract Error",
          description: "Contract response not found",
          variant: "destructive",
        });
        return;
      }
      setContractLoading(false);
      const { error } = await mutate({
        input: {
          name: value.name,
          creatorAddress: activeAddress,
          maxContributors: Number(value.maxContributors),
        },
      });

      if (error?.graphQLErrors) {
        error.graphQLErrors.map((err) =>
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          }),
        );
      } else {
        toast({
          title: "Success",
          description: `Pool ${
            value.name
          } has been created with ${ellipseAddress(
            activeAddress,
          )} as the manager`,
        });
        onClose && onClose();
      }
    } catch (error) {
      console.log(error);
      setContractLoading(false);
      toast({
        title: "Transaction Error",
        description: "Failed to authorize creation on contract",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className="flex flex-row ">
                  Pool Name&nbsp;
                  <TooltipInfo description="Name of the pool you wish to create" />
                </div>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-x-6 gap-2 py-4 md:flex-row">
          <div className="flex-1 flex gap-y-2 flex-col justify-between">
            <FormField
              control={form.control}
              name="maxContributors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Max Contributors</FormLabel>
                  <FormControl>
                    <Input
                      max={100}
                      type="number"
                      placeholder="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <fieldset className="flex flex-col gap-4 mt-4">
          <div>
            <legend className="text-muted-foreground py-2">
              Initial Contribution
            </legend>
            <hr />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex flex-row ">
                      Asset&nbsp;
                      <TooltipInfo description="Select the crypto asset you wish to contribute to the pool" />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <AssetSelectCombobox
                      onSelect={(v) => {
                        if (v) {
                          setAssetDecimals(v.decimals);
                          field.onChange(v.assetId);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fundAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.0" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        <div className="w-full flex items-end justify-end">
          <Button
            loading={fetching || contractLoading}
            disabled={fetching || contractLoading}
            className="w-full max-w-[100px]"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PoolForm;
