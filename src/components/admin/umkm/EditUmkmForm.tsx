"use client";

import UmkmForm from "./UmkmForm";


interface Props{
 data:any;
}


export default function EditUmkmForm({
 data
}:Props){

 return (
   <UmkmForm
     mode="edit"
     data={data}
   />
 );

}