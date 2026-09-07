// Deliberately fictional thresholds, never clinical CLSI or EUCAST data.
export const demoDiscs = [
 {code:"CIP",name:"Ciprofloxacin",potency:"5",mm:25.4},
 {code:"AMC",name:"Amoxicillin–clavulanate",potency:"20/10",mm:19},
 {code:"MEM",name:"Meropenem",potency:"10",mm:28},
 {code:"GEN",name:"Gentamicin",potency:"10",mm:18.6},
 {code:"SXT",name:"Trimethoprim–sulfamethoxazole",potency:"1.25/23.75",mm:26},
 {code:"AMP",name:"Ampicillin",potency:"10",mm:6}
];
export function threshold(code,profile){const i=demoDiscs.findIndex(d=>d.code===code);const s=[23,22,24,21,23,19][i];const r=[17,16,18,15,17,13][i];return {s:s+(profile==="B"?3:0),r:r+(profile==="B"?2:0)}}
export function classify(mm,code,profile){if(!Number.isFinite(mm)||mm<6||mm>40)return null;const {s,r}=threshold(code,profile);return mm>=s?"S":mm<r?"R":"I"}
