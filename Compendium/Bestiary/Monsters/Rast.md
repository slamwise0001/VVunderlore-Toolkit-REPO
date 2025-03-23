---
name: Rast
size: Medium
type: Elemental
alignment: Neutral
ac: 14 (natural armor)
hp: 26
speed: walk 5, fly {'number': 50, 'condition': ' (hover)'}
cr: 2
strength: 14
dexterity: 12
constitution: 14
intelligence: 4
wisdom: 13
charisma: 12
saving_throws:
skills:
senses: darkvision 60 ft.
languages:
weaknesses:
resistances:
immunities:
  - fire
  - poison
  - poisoned
  - prone
---

# Rast

*Medium Elemental, Neutral*

**Abilities**

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| 14 | 12 | 14 | 4 | 13 | 12 |

**Armor Class**: 14 (natural armor)

**Hit Points**: 26

**Speed**: walk 5, fly {'number': 50, 'condition': ' (hover)'}

**Senses**: darkvision 60 ft.

**Challenge**: 2

### Traits
***Paralyzing Gaze.*** If a creature starts its turn within 30 feet of the rast and the two of them can see each other, the rast can force the creature to make a DC 11 Wisdom saving throw if the rast isn't incapacitated, becoming paralyzed on a failed save. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. A creature that succeeded on a saving throw against the rast's Paralyzing Gaze is immune to the effect for the next 24 hours. A creature that isn't surprised can avert its eyes to avoid the saving throws at the start of its turn. If it does so, it can't see the rast until the start of its next turn, when it can avert its eyes again.

***Tangle of Claws.*** If it is grappling a creature, the rast may make two additional claw attacks against the grappled creature as a bonus action.

### Actions
***Multiattack.*** The rast makes three melee attacks: one with its bite and two with its claws.

***Bite.*** Melee Weapon Attack: {@hit +4} to hit, reach 5 ft., one target. Hit: 6 ({@dice 1d8+2}) piercing damage and the target is grappled (escape DC 12). Until this grapple ends, the rast can't use its bite against another target.

***Claws.*** Melee Weapon Attack: {@hit +4} to hit, reach 5 ft., one target. Hit: 7 ({@dice 2d4+2}) slashing damage.

***Blood Drain.*** The rast makes a single bite attack against a creature it is grappling. If this attack hits, the target's hit point maximum is reduced by an amount equal to the damage dealt, and the rast regains that many hit points.

