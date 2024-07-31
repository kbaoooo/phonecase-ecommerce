

import { PRODUCT_PRICES } from "@/configs/products";

export const COLORS = [
    {
        label: 'Black',
        value: 'black',
        tw: 'zinc-900'
    },
    {
        label: 'Blue',
        value: 'blue',
        tw: 'blue-950'
    },
    {
        label: 'Rose',
        value: 'rose',
        tw: 'rose-950'
    },
] as const;

export const PHONETYPE = {
    name: 'phonetype',
    options: [
        {
            label: 'iPhone X',
            value: 'iphoneX'
        },
        {
            label: 'iPhone 11',
            value: 'iphone11'
        },
        {
            label: 'iPhone 12',
            value: 'iphone12'
        },
        {
            label: 'iPhone 13',
            value: 'iphone13'
        },
                {
            label: 'iPhone 14',
            value: 'iphone14'
        },
        {
            label: 'iPhone 15',
            value: 'iphone15'
        },
    ]
} as const;

export const MATERIALS = {
    name: 'materials',
    options: [
        {
            label: 'Silicone',
            value: 'silicone',
            description: undefined,
            price: PRODUCT_PRICES.materials.silicone
        },
        {
            label: 'Soft Polycarbonate',
            value: 'polycarbonate',
            description: 'Scratch resistant coating',
            price: PRODUCT_PRICES.materials.polycarbonate
        }
    ]
} as const;

export const FINISHES = {
    name: 'finishes',
    options: [
        {
            label: 'Smooth Finish',
            value: 'smooth',
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: 'Textured Finish',
            value: 'textured',
            description: 'Soft grip texture',
            price: PRODUCT_PRICES.finish.textured
        }
    ]
} as const;