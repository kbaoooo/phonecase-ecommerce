"use client"

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from 'next/image';
import {Rnd} from 'react-rnd';
import { RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import { COLORS, FINISHES, MATERIALS, PHONETYPE } from "@/validatiors/option-validator";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASE_PRICE } from "@/configs/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
    configId: string;
    imageUrl: string;
    imgDimensions: {
        width: number;
        height: number;
    };
}

function DesignConfigurator({configId, imageUrl, imgDimensions}: DesignConfiguratorProps) {
    const { toast } = useToast();
    const router = useRouter();

    const { mutate: saveConfig, isPending } = useMutation({
        mutationKey: ['save-config'],
        mutationFn: async function (args: SaveConfigArgs){
           await Promise.all([saveConfiguration(), _saveConfig(args)]);
        },
        onError: function (error){
            toast({
                title: 'Something went wrong',
                description: 'There was a problem saving your config, please try again.',
                variant: "destructive"
            })
        },
        onSuccess: function (){
            router.push('/configure/preview?id=' + configId);
        }
    })

    const [ options, setOptions ] = useState<{
        color: (typeof COLORS)[number],
        phoneType: (typeof PHONETYPE.options)[number],
        materials: (typeof MATERIALS.options)[number],
        finishes: (typeof FINISHES.options)[number]
    }>({
        color: COLORS[0],
        phoneType: PHONETYPE.options[0],
        materials: MATERIALS.options[0],
        finishes: FINISHES.options[0]
    });

    const [ renderedDimension, setRenderedDimension ] = useState({
        width: imgDimensions.width / 4,
        height: imgDimensions.height / 4,
    })

    const [ renderedPosition, setRenderedPosition ] = useState({
        x: 150,
        y: 205
    })

    const phoneCaseRef = useRef<HTMLDivElement>(null);
    const phoneContainerRef = useRef<HTMLDivElement>(null);

    const { startUpload } = useUploadThing("imageUploader", {})

    async function saveConfiguration() {
        try {
            const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();
            const { left: containerLeft, top: containertop } = phoneContainerRef.current!.getBoundingClientRect();
            
            const leftOffset = caseLeft - containerLeft;
            const topOffset = caseTop - containertop;

            const actualX = renderedPosition.x - leftOffset;
            const actualY = renderedPosition.y - topOffset;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            const userImage = new Image();
            userImage.crossOrigin = 'anonymous';
            userImage.src = imageUrl;

            await new Promise(function (resolve) {
                return userImage.onload = resolve;
            });
            ctx?.drawImage(
                userImage, 
                actualX, 
                actualY, 
                renderedDimension.width, 
                renderedDimension.height
            );

            const base64 = canvas.toDataURL();
            const base64Data = base64.split(',')[1];

            const blob = base64ToBlob(base64Data, "image/png");
            const file = new File([blob], 'design.png', {type: 'image/png'});

            await startUpload([file], {
                configId, 
            });

        } catch (error) {
            toast({
                title: 'Something went wrong',
                description: 'There was a problem saving your config, please try again.',
                variant: "destructive"
            })
        }
    }

    function base64ToBlob(base64: string, type: string) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type});
    }

    return ( 
        <div
            className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20"
        >
            <div ref={phoneContainerRef} className="relative h-[37.5rem] overflow-hidden col-span-2 max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
                    <AspectRatio 
                        ref={phoneCaseRef}
                        ratio={896 / 1831}
                        className="pointer-events-none relative z-50 aspect-[896 / 1831] w-full"    
                    >
                        <NextImage fill src='/phone-template.png' alt="phone image" className="pointer-events-none z-50 select-none"/>
                    </AspectRatio>
                    <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.5)]" />

                    <div
                        className={cn('absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]',
                            {
                                'bg-zinc-900': options.color.tw === 'zinc-900', 
                                'bg-blue-950': options.color.tw === 'blue-950',
                                'bg-rose-950': options.color.tw === 'rose-950'
                            }
                        )}
                    />
                </div>

                <Rnd 
                    onResizeStop={function (_, __, ref, ___, { x, y }) {
                        setRenderedDimension({
                            width: parseInt(ref.style.width.slice(0, -2)),
                            height: parseInt(ref.style.height.slice(0, -2))
                        });
                        setRenderedPosition({
                            x,
                            y
                        });
                    }}
                    onDragStop={function (_, { x, y }) {
                        setRenderedPosition({
                            x,
                            y
                        });
                    }}
                    default={{
                        x: 150,
                        y: 205,
                        width: imgDimensions.width / 4,
                        height: imgDimensions.height /4,
                    }}
                    lockAspectRatio
                    resizeHandleComponent={{
                        bottomLeft: <HandleComponent />,
                        bottomRight: <HandleComponent />,
                        topLeft: <HandleComponent />,
                        topRight: <HandleComponent />
                    }}
                    className="absolute z-20 border-[3px] border-primary"
                >
                    <div className="relative w-full h-full">
                        <NextImage 
                            className="pointer-events-none" 
                            src={imageUrl} 
                            fill 
                            alt='your image'
                        />
                    </div>
                </Rnd>
            </div>

            <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
                <ScrollArea className="relative flex-1 overflow-auto">
                    <div aria-hidden='true' className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"/>
                    <div className="px-8 pb-12 pt-8">
                        <h2 className="tracking-tight font-bold text-3xl">Customize your case</h2>
                        <div className="w-full h-px bg-zinc-200 my-6 "/>
                        <div className="relative mt-4 h-full flex flex-col justify-between">
                            <div className="flex flex-col gap-6">
                                <RadioGroup 
                                    value={options.color} 
                                    onChange={(value) => {
                                        setOptions((prev) => ({
                                            ...prev,
                                            color: value
                                        }));
                                    }}
                                >
                                    <Label>Color: {options.color.label}</Label>
                                    <div className="mt-3 flex items-center space-x-3">
                                        {COLORS.map((color) => {
                                            const borderColor = 'border-' + options.color.tw;
                                            const bgColor = 'bg-' + color.tw;

                                            return (
                                                <RadioGroup.Option
                                                    key={color.value}
                                                    value={color}
                                                    className={({active, checked}) => {
                                                        return cn('relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active-ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent', {
                                                            'border-zinc-900': borderColor === 'border-zinc-900' && (active || checked), 
                                                            'border-blue-950': borderColor === 'border-blue-950' && (active || checked), 
                                                            'border-rose-950': borderColor === 'border-rose-950' && (active || checked), 
                                                        })
                                                    }}
                                                >
                                                    <span className={cn(`h-8 w-8 rounded-full border-black border-opacity-10 ${bgColor}`)}/>
                                                </RadioGroup.Option>
                                            )
                                        })}
                                    </div>
                                </RadioGroup>

                                <div className="relative flex flex-col gap-3 w-full">
                                    <Label>Phone</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant='outline' 
                                                role="combobox"
                                                className="w-full justify-between"
                                            >
                                                {options.phoneType.label}
                                                <ChevronsUpDown 
                                                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                                />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {PHONETYPE.options.map((_phoneType) => {
                                                return (
                                                    <DropdownMenuItem
                                                        key={_phoneType.value}
                                                        className={cn(
                                                            'flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100', {
                                                            'bg-zinc-100': _phoneType.value === options.phoneType.value
                                                            }
                                                        )}
                                                        onClick={() => {
                                                            setOptions((prev) => ({
                                                                ...prev,
                                                                phoneType: _phoneType
                                                            }));
                                                        }}
                                                    >
                                                        <Check 
                                                            className={cn('mr-2 h-4 w-4', 
                                                                _phoneType.value === options.phoneType.value ? 'opacity-100' : 'opacity-0'
                                                            )}
                                                        />
                                                        {_phoneType.label}
                                                    </DropdownMenuItem>
                                                    )
                                                })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {[MATERIALS, FINISHES].map(({name, options: selectableOptions}) => {
                                    return(
                                        <RadioGroup key={name} value={options[name]} onChange={(value) => {
                                            setOptions((prev) => ({
                                                ...prev,
                                                [name]: value
                                            }));
                                        }}>
                                            <Label>{name.slice(0, 1).toUpperCase() + name.slice(1)}</Label>
                                            <div className="mt-3 space-y-4">
                                                {selectableOptions.map((option) => {
                                                    return (
                                                        <RadioGroup.Option
                                                            key={option.value}
                                                            value={option}
                                                            className={({active, checked}) => cn('relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between', {
                                                                'border-primary': active || checked,
                                                            })}
                                                        >
                                                            <span className="flex items-center">
                                                                <span className="flex flex-col text-sm">
                                                                    <RadioGroup.Label className='font-medium text-gray-900' as="span">
                                                                        {option.label}
                                                                    </RadioGroup.Label>

                                                                    {option.description ? <RadioGroup.Description as='span' className='text-gray-500'>
                                                                        <span className="block sm:inline">{option.description}</span>
                                                                    </RadioGroup.Description> : null}
                                                                </span>
                                                            </span>

                                                            <RadioGroup.Description as="span"
                                                                className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'
                                                            >
                                                                <span className="font-medium text-gray-900">
                                                                    {formatPrice(option.price / 100)}
                                                                </span>
                                                            </RadioGroup.Description>
                                                        </RadioGroup.Option>
                                                    )
                                                })}
                                            </div>
                                        </RadioGroup>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="w-full px-8 h-16 bg-white">
                    <div className="h-px w-full bg-zinc-200"/>
                    <div className="w-full h-full flex justify-end items-center">
                        <div className="w-full flex gap-6 items-center">
                            <p className="font-medium whitespace-nowrap">
                                {formatPrice((BASE_PRICE + options.finishes.price + options.materials.price) / 100)}
                            </p>
                            <Button 
                                disabled={isPending}
                                isLoading={isPending}
                                loadingText="Saving"
                                size='sm' 
                                className="w-full" 
                                onClick={() => saveConfig({
                                    configId,
                                    color: options.color.value,
                                    finish: options.finishes.value,
                                    material: options.materials.value,
                                    phoneType: options.phoneType.value
                            })}>
                                Continue 
                                <ArrowRightIcon className="h-4 w-4 ml-1.5 inline"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesignConfigurator;
