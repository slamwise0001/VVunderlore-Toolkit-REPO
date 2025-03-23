---
name: Elder Dinosaur (Etali, Primal Storm)
size: Gargantuan
type: Monstrosity (Titan)
alignment: 
ac: 25 (natural armor)
hp: 676
speed: walk 40
cr: 30
strength: 30
dexterity: 11
constitution: 30
intelligence: 3
wisdom: 11
charisma: 11
saving_throws:
  - int
  - wis
  - cha
skills:
senses: blindsight 120 ft.
languages:
weaknesses:
resistances:
immunities:
  - fire
  - poison
  - {'immune': ['bludgeoning', 'piercing', 'slashing'], 'note': 'from nonmagical attacks'}
  - charmed
  - frightened
  - paralyzed
  - poisoned
---

# Elder Dinosaur (Etali, Primal Storm)

*Gargantuan Monstrosity (Titan)*

**Abilities**

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| 30 | 11 | 30 | 3 | 11 | 11 |

**Armor Class**: 25 (natural armor)

**Hit Points**: 676

**Speed**: walk 40

**Saving Throws**:
  - int
  - wis
  - cha

**Senses**: blindsight 120 ft.

**Challenge**: 30

### Traits
***Legendary Resistance (3/Day).*** If the elder dinosaur fails a saving throw, it can choose to succeed instead.

***Magic Resistance.*** The elder dinosaur has advantage on saving throws against spells and other magical effects.

***Siege Monster.*** The elder dinosaur deals double damage to objects and structures.

***Lightning Storm.*** The elder dinosaur is always accompanied by a raging thunderstorm similar to the effect of a {@spell call lightning} spell. A storm cloud in the shape of a cylinder that is 10 feet tall with a 60-foot radius instantly forms 100 feet in the air over the elder dinosaur when it is angered or becomes violent, as long as it is outdoors. On each of its turns, as an action, the elder dinosaur can choose a point it can see within 120 feet of it. A bolt of lightning flashes down from the cloud to that point. Each creature within 10 feet of that point must make a DC 20 Dexterity saving throw, taking 21 ({@dice 6d6}) lightning damage on a failed save, or half as much damage on a successful one.

### Actions
***Multiattack.*** The elder dinosaur can use its Frightful Presence and call down two lightning strikes from its Lightning Storm. It then makes three attacks: one with its bite and two with its claws.

***Bite.*** Melee Weapon Attack: {@hit +19} to hit, reach 10 ft., one target. Hit: 36 ({@dice 4d12 + 10}) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the elder dinosaur can't bite another target.

***Claw.*** Melee Weapon Attack: {@hit +19} to hit, reach 15 ft., one target. Hit: 28 ({@dice 4d8 + 10}) slashing damage.

***Frightful Presence.*** Each creature of the elder dinosaur's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the elder dinosaur is within line of sight, ending the effect on itself ona success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the elder dinosaur's Frightful Presence for the next 24 hours.

***Swallow.*** The elder dinosaur makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, that creature takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the elder dinosaur, and it takes 56 ({@dice 16d6}) acid damage at the start of each of the elder dinosaur's turns.If the elder dinosaur takes 60 damage or more on a single turn from a creature inside it, it must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of it. If the elder dinosaur dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 20 feet of movement, exiting prone.

### Legendary Actions
***Attack.*** The elder dinosaur makes one claw attack, tail attack, wing attack, or flipper attack.

***Move.*** The elder dinosaur moves up to half its speed.

***Chomp (Costs 2 Actions).*** The elder dinosaur makes one bite attack or uses its Swallow.

