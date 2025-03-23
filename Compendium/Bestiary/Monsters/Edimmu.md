---
name: Edimmu
size: Medium
type: Undead
alignment: 
ac: 15
hp: 75
speed: walk 0, fly {'number': 60, 'condition': ' (hover)'}
cr: 4
strength: 1
dexterity: 19
constitution: 16
intelligence: 12
wisdom: 13
charisma: 13
saving_throws:
skills:
senses: blindsight 60 ft.
languages:
  - Common but can't speak
weaknesses:
resistances:
  - Acid
  - Cold
  - Fire
  - Lightning
  - Thunder
  - bludgeoning, piercing, slashing from from nonmagical weapons
immunities:
  - necrotic
  - poison
  - charmed
  - exhaustion
  - grappled
  - frightened
  - paralyzed
  - petrified
  - poisoned
  - prone
  - restrained
  - unconscious
---

# Edimmu

*Medium Undead*

**Abilities**

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| 1 | 19 | 16 | 12 | 13 | 13 |

**Armor Class**: 15

**Hit Points**: 75

**Speed**: walk 0, fly {'number': 60, 'condition': ' (hover)'}

**Senses**: blindsight 60 ft.

**Languages**:
  - Common but can't speak

**Challenge**: 4

### Traits
***Rejuvenation.*** If destroyed, an edimmu rises again in {@dice 2d4} days. Permanently destroying one requires properly burying its mortal remains in consecrated or hallowed ground. Edimmus rarely venture more than a mile from the place of their death.

***Incorporeal Movement.*** The edimmu can move through other creatures and objects as if they were difficult terrain. It takes 5 ({@dice 1d10}) force damage if it ends its turn inside an object.

### Actions
***Water Siphon.*** Melee Spell Attack: {@hit +7} to hit, reach 5 ft., one creature. Hit: 21 ({@dice 6d6}) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken and it is stunned for 1 minute and gains one level of exhaustion. A stunned creature repeats the saving throw at the end of each of its turns, ending the stun on itself on a success. The hit point reduction lasts until the creature finishes a long rest and drinks abundant water or until it is affected by greater restoration or comparable magic. The target dies if this effect reduces its hit point maximum to 0.

