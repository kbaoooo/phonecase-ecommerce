import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

async function Page ({searchParams}: PageProps) {
    const { id } = searchParams;

    if(!id || typeof id !== 'string') {
        return notFound();
    }

    const configuration = await db.configuration.findUnique({
        where: { id }
    }); 


    if(!configuration) {
        return notFound();
    }


    return (
       <DesignConfigurator 
            configId={configuration.id}
            imageUrl={configuration.imageUrl}
            imgDimensions={{
                width: configuration.width,
                height: configuration.height
            }}
       />
    );
}

export default Page;
