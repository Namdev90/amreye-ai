"use client";
import { Children, useEffect, useState, type ReactNode } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
export default function MobileSection({children, className, id}: {children: ReactNode; className: string; id?: string}) {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = matchMedia("(max-width:850px)");
    const sync = () => { setMobile(media.matches); setOpen(!media.matches); };
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const content = Children.toArray(children);
  return <section className={`${className} mobile-fold-section`} id={id}>
    {content[0]}
    <Accordion type="single" collapsible value={open || !mobile ? "details" : ""} onValueChange={value=>setOpen(!!value)}>
      <AccordionItem value="details">
        <AccordionTrigger className="mobile-section-trigger">{open ? "Hide details" : "Explore this section"}</AccordionTrigger>
        <AccordionContent className="mobile-section-content">{content.slice(1)}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>;
}
