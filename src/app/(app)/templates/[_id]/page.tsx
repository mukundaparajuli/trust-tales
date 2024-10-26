'use client'

import TempFour from "@/components/templates/TempFour"
import TempOne from "@/components/templates/TempOne"
import TempThree from "@/components/templates/TempThree"
import TempTwo from "@/components/templates/TempTwo"
import axios from "axios";
import { useEffect, useState } from "react";


export default function Page({ params }: {
    params: {
        _id: string;
    }
}) {

    const [messages, setMessages] = useState();
    const { _id } = params;
    console.log(_id);
    const fetchMessage = async () => {
        try {
            const response = await axios.get(`/api/get-message/` + _id);
            console.log(response.data);
            setMessages(response.data.message)
        } catch (error) {
            console.error("Error fetching message:", error);
            return null;
        }

    }
    useEffect(() => {
        fetchMessage();
    }, [])


    return (
        <div className="flex m-0 p-0">
            {messages && <TempOne {...messages} />}
            {/* <TempTwo {...messages} />
            <TempThree {...messages} />
            <TempFour {...messages} /> */}

        </div>
    )
}