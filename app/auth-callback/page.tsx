'use client';

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAuthStatus } from "./actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function Page() {
    const [configId, setConfigId] = useState<string | null>(null)
    const router = useRouter();

    useEffect(function() {
        const configurationId = localStorage.getItem('configId');
        if(configurationId) {
            setConfigId(configurationId);
        }
    }, [])

    const {data} = useQuery({
        queryKey: ['auth-callback'],
        queryFn: async function () {
            return await getAuthStatus();
        },
        retry: true,
        retryDelay: 500,
    })
    
    if(data && data?.success) {
        if(configId) {
            localStorage.removeItem('configId');  
            router.push(`/configure/preview?id=${configId}`);
        } else {
            router.push('/');
        }
    }

    return (
        <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500"/>
                <h3 className="font-semibold text-xl">
                    Logging you in...
                </h3>
                <p>You will be redirected automaticlly.</p>
            </div>
        </div>
    );
}

export default Page;
