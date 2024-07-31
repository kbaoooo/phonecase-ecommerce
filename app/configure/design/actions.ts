'use server';
import { db } from '@/db';

import { CaseColor, CaseFinish, CaseMaterial, PhoneType } from '@prisma/client';

export type SaveConfigArgs = {
    color: CaseColor,
    finish: CaseFinish,
    material: CaseMaterial,
    phoneType: PhoneType,
    configId: string
}

export async function saveConfig({
    color,
    finish,
    material,
    phoneType,
    configId
}: SaveConfigArgs) {
    const configuration = await db.configuration.update({
        where: {id: configId},
        data: {
            color,
            finish,
            material,
            phoneType
        }
    });

    return configuration;

}