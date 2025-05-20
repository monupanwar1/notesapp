import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import Sidebar from "@/components/Sidebar";
import { useState } from "react"

export default function Dashboard() {
  const[modelOpen,setModelOpen]=useState(false);
  return (
    <div>
      <Sidebar/>
        <div className="flex justify-end gap-4">
          <Button onClick={()=>setModelOpen(true)} variant="primary" text="Add content"/>
          <Button onClick={()=>setModelOpen(true)} variant="primary" text="share content"/>
        </div>
        <div className="flex gap-4 flex-wrap">
         <Card/>
         <Card/>
         <Card/>
        </div>
      </div>
  )
}