<%*
let statblock = `
\`\`\`statblock
layout: Basic 5e Layout
image: 
name: ${await tp.system.prompt("Enter Name")}
size: 
type: 
subtype: 
alignment: 
ac: 
hp: 
hit_dice: 
speed: 
stats: 
fage_stats: 
saves:
  - dash: 
  - potato: 
  - stew: 
skillsaves:
  - fake-skill: 
  - turtle: 
damage_vulnerabilities: 
damage_resistances: 
damage_immunities: 
condition_immunities: 
senses: string
languages: string
cr: number
spells:
  - 
  - 
  -  
traits:
  - name: 
    desc: 
  - name: 
    desc: 
actions:
  - name: 
    desc: 
  - name: 
    desc: 
legendary_actions:
  - name: 
    desc: 
  - name: 
    desc: 
bonus_actions:
  - name: 
    desc: 
  - name: 
    desc: 
reactions:
  - name: 
    desc: 
  - name: 
    desc: 
\`\`\`
`
tR += statblock;
%>
