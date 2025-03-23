---
name: Illithilich
size: Medium
type: Undead
alignment: 
ac: 17 (natural armor)
hp: 135
speed: walk 30
cr: 22
strength: 11
dexterity: 16
constitution: 16
intelligence: 20
wisdom: 14
charisma: 16
saving_throws:
  - con
  - int
  - wis
skills:
  - arcana
  - history
  - insight
  - perception
senses: truesight 120 ft.
languages:
  - Deep Speech, Undercommon, telepathy 120 ft.
weaknesses:
resistances:
  - Cold
  - Lightning
  - Necrotic
immunities:
  - poison
  - {'immune': ['bludgeoning', 'piercing', 'slashing'], 'note': 'from nonmagical attacks'}
  - charmed
  - exhaustion
  - frightened
  - paralyzed
  - poisoned
---

# Illithilich

*Medium Undead*

**Abilities**

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| 11 | 16 | 16 | 20 | 14 | 16 |

**Armor Class**: 17 (natural armor)

**Hit Points**: 135

**Speed**: walk 30

**Saving Throws**:
  - con
  - int
  - wis

**Skills**:
  - arcana
  - history
  - insight
  - perception

**Senses**: truesight 120 ft.

**Languages**:
  - Deep Speech, Undercommon, telepathy 120 ft.

**Challenge**: 22

### Traits
***Legendary Resistance (3/Day).*** If the illithilich fails a saving throw, it can choose to succeed instead.

***Rejuvenation.*** If it has a phylactery, a destroyed illithilich gains a new body in {@dice 1d10} days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery.

***Turn Resistance.*** The illithilich has advantage on saving throws against any effect that turns undead.

***Magic Resistance.*** The illithilich has advantage on saving throws against spells and other magical effects.

### Actions
***Paralyzing Touch.*** Melee Spell Attack: {@hit +12} to hit, reach 5 ft., one creature. Hit: 10 ({@dice 3d6}) cold damage. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.

***Tentacles.*** Melee Weapon Attack: {@hit +12} to hit, reach 5 ft., one creature. Hit: 21 ({@dice 3d10+5}) psychic damage. If the target is Large or smaller, it is grappled (escape DC 15) and must succeed on a DC 20 Intelligence saving throw or be stunned until this grapple ends.

***Extract Brain.*** Melee Weapon Attack: {@hit +12} to hit, reach 5 ft., one incapacitated humanoid grappled by the lich. Hit: 55 ({@dice 10d10}) piercing damage. If this damage reduces the target to 0 hit points, the lich kills the target by extracting and devouring its brain.

***Mind Blast (Recharge 5—6).*** The illithilich magically emits psychic energy in a 60-foot cone. Each creature in that area must succeed on a DC 18 Intelligence saving throw or take 27 ({@dice 5d8+5}) psychic damage and be stunned for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.

### Legendary Actions
***Tentacles.*** The illithilich makes one attack with its tentacles.

***Extract Brain (Costs 2 Actions).*** The illithilich uses Extract Brain.

***Mind Blast (Costs 3 Actions).*** The illithilich recharges its Mind Blast and uses it.

***Cast Spell (Costs 1-3 Actions).*** The illithilich uses a spell slot to cast a 1st-, 2nd-, or 3rd-level spell that it has prepared. Doing so costs 1 legendary action per level of the spell.

