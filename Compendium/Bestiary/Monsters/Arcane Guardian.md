---
name: Arcane Guardian
size: Medium
type: Undead
alignment: 
ac: 14
hp: 110
speed: walk 0, fly {'number': 60, 'condition': ' (hover)'}
cr: 8
strength: 6
dexterity: 18
constitution: 18
intelligence: 11
wisdom: 16
charisma: 18
saving_throws:
  - dex
  - wis
skills:
senses: blindsight 10 ft., darkvision 60 ft.
languages:
  - understands the languages it knew in life but can't speak
weaknesses:
resistances:
  - Acid
  - Fire
  - Lightning
  - Thunder
  - bludgeoning, piercing, slashing from from nonmagical weapons
immunities:
  - cold
  - necrotic
  - poison
  - charmed
  - exhaustion
  - frightened
  - grappled
  - paralyzed
  - petrified
  - poisoned
  - prone
  - restrained
---

# Arcane Guardian

*Medium Undead*

**Abilities**

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| 6 | 18 | 18 | 11 | 16 | 18 |

**Armor Class**: 14

**Hit Points**: 110

**Speed**: walk 0, fly {'number': 60, 'condition': ' (hover)'}

**Saving Throws**:
  - dex
  - wis

**Senses**: blindsight 10 ft., darkvision 60 ft.

**Languages**:
  - understands the languages it knew in life but can't speak

**Challenge**: 8

### Traits
***Incorporeal Movement.*** The spectral guardian can move through other creatures and objects as if they were difficult terrain. It takes 5 ({@dice 1d10}) force damage if it ends its turn inside an object.

***Tomb Bound.*** The spectral guardian is bound to the area it defends. It can't move more than 100 feet from the place it is bound to protect.

***Withering Miasma.*** A creature that starts its turn in the spectral guardian's space must make a successful DC 15 Constitution saving throw or take 18 ({@dice 4d8}) necrotic damage and its hit point maximum is reduced by an amount equal to the necrotic damage taken. This reduction lasts until the creature finishes a long rest.

### Actions
***Multiattack.*** The spectral guardian makes two spectral rend attacks.

***Spectral Rend.*** Melee Weapon Attack: {@hit +7} to hit, reach 5 ft., one target. Hit: 13 ({@dice 2d8+4}) necrotic damage. If the target is a creature, it must succeed on a DC 14 Wisdom saving throw or be frightened and have its speed reduced to 0; both effects last until the end of its next turn.

