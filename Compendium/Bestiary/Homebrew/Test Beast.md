---
name: "Test Beast"
classification: "Beasts"
size: "Tiny"
type: "Humanoid"
alignment: "Lawful Good"
armor_class: 10 (Natural Armor)
hit_points: 1
hit_die: "d6"
speed:
  Walk: 30 ft
  Swim: 0 ft
  Fly: 0 ft
strength: 10
dexterity: 10
constitution: 10
intelligence: 10
wisdom: 10
charisma: 10
proficiency_bonus: +2
saving_throws:
- None
skills:
- None
damage_vulnerabilities:
- None
damage_resistances:
- None
damage_immunities:
- None
condition_immunities:
- None
senses:
- None
challenge_rating: "0"
---
# `= this.name`
_`= this.size` `= this.type`, `= this.alignment`_

>[!info] *Description* 
>*Always there, always two steps ahead, watching you fail the way it allowed itself to fail. It subsists off the potential success or failure of those that follow in it's exact footsteps. Most of the time... it's failure.*


**Armor Class:** `= this.armor_class`  
**Hit Points:** `= this.hit_points` (`= this.hit_die`)  
**Speed:** Walk `= this.speed.Walk`, Swim `= this.speed.Swim`, Fly `= this.speed.Fly`

### **Abilities**
| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| `= this.strength` (`= floor((this.strength - 10) / 2)`) | `= this.dexterity` (`= floor((this.dexterity - 10) / 2)`) | `= this.constitution` (`= floor((this.constitution - 10) / 2)`) | `= this.intelligence` (`= floor((this.intelligence - 10) / 2)`) | `= this.wisdom` (`= floor((this.wisdom - 10) / 2)`) | `= this.charisma` (`= floor((this.charisma - 10) / 2)`) |

**Proficiency Bonus:** +`= this.proficiency_bonus`  
**Saving Throws:** `= this.saving_throws`  
**Skills:** `= this.skills`  
**Damage Vulnerabilities:** `= this.damage_vulnerabilities`  
**Damage Resistances:** `= this.damage_resistances`  
**Damage Immunities:** `= this.damage_immunities`  
**Condition Immunities:** `= this.condition_immunities`  
**Senses:** `= this.senses`  
**Challenge Rating:** `= this.challenge_rating`

##### **Traits**
None

##### **Actions**
None

##### **Reactions**
None

##### **Legendary Actions**
None

##### **Lair Actions**
None

##### **Regional Effects**
None

## Description
This is a monster I invented and wrote about for 1 minute. There needs to be a file in the Homebrew folder in order for the form to detect it for the "Classification" question. Very annoying. I'll fix it so it's different eventualy.