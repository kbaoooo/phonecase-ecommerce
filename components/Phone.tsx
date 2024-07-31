/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
    imgSrc: string; 
    dark?: boolean;
}

function Phone({ 
    imgSrc, 
    className,
    dark = false,
    ...props
}: PhoneProps) {
    return (
        <div {...props} className={cn('relative pointer-events-none z-50 overflow-hidden', className)}>
            <img
                className="pointer-events-none z-50 select-none" 
                src={
                    dark 
                    ? "/phone-template-dark-edges.png" 
                    : "/phone-template-white-edges.png"
                } 
                alt="phone-image" 
            />

            <div className="absolute -z-10 inset-0 min-w-full him-h-full">
                <img className="object-cover" src={imgSrc} alt="overlaying phone image"/>
            </div>
        </div>
    );
}

export default Phone;
