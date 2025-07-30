import {serve} from  "inngest/next"
import {inngest} from "@/lib/inngest/client"
import { checkBudget, generateMonthlyReports } from "@/lib/inngest/function"

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions:[
       checkBudget, 
       generateMonthlyReports,
    ]
})