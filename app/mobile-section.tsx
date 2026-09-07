"use client";
import type {ReactNode} from "react";
export default function MobileSection({children,className,id}:{children:ReactNode;className:string;id?:string}){return <section className={className} id={id}>{children}</section>}
