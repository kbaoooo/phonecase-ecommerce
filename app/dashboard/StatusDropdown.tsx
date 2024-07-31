'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@prisma/client";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changeOrderStatus } from "./actions";
import { useRouter } from "next/navigation";

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
    awaiting_shipment: 'Awaiting Shipment',
    shipped: 'Shipped',
    fulfilled: 'Fulfilled',
}

export default function StatusDropdown({id, orderStatus}: {id: string, orderStatus: OrderStatus}) {

  const router = useRouter()

  const { mutate } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh()
  })

    
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='outline' className="w-52 flex justify-between items-center">
                {LABEL_MAP[orderStatus]}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
            {Object.keys(OrderStatus).map((status) => (
              <DropdownMenuItem key={status} className={cn('flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100',{
                'bg-zinc-100': status === orderStatus,
              })}
                onClick={() => mutate({id, newStatus: status as OrderStatus})}
              >
                <Check className={cn('mr-2 h-4 w-4 text-primary', 
                  orderStatus === status ? 'opacity-100' : 'opacity-0'
                )} />
                {LABEL_MAP[status as keyof typeof OrderStatus]}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
