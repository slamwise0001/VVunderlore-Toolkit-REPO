---
name: Furnace Golem
size: Large
type: Construct
alignment: 
ac: 16 (natural armor)
hp: 152
speed: walk 20
cr: 9
strength: 22
dexterity: 9
constitution: 19
intelligence: 3
wisdom: 11
charisma: 1
saving_throws:
skills:
senses: darkvision
languages:
  - Understands the language of it's creator but can't speak
weaknesses:
resistances:
  - Cold
immunities:
  - fire
  - poison
  - psychic
  - {'immune': ['bludgeoning', 'piercing', 'slashing'], 'note': 'damage from weapons that are neither magical nor adamantine'}
  - charmed
  - frightened
  - paralyzed
---

# Furnace Golem

*Large Construct*

**Abilities**

| STR | DEX | CON | INT | WIS | CHA |
| --- | --- | --- | --- | --- | --- |
| 22 | 9 | 19 | 3 | 11 | 1 |

**Armor Class**: 16 (natural armor)

**Hit Points**: 152

**Speed**: walk 20

**Senses**: darkvision

**Languages**:
  - Understands the language of it's creator but can't speak

**Challenge**: 9

### Traits
***Cold and Fire Sensitivity.*** If a furnace golem takes cold damage, its speed is halved, it can't take bonus actions, and it can make only one attack until the end of its next turn. If it is attacked with fire, it takes no damage but instead heals 1 hit point per 3 points of fire damage the attack would have inflicted. Excess hit points are gained as temporary hit points.

***Furnace.*** As a bonus action at the start of its turn, a furnace golem can try to shove a grappled opponent into its interior furnace. The furnace golem makes a Strength check that is opposed by the grappled creature's Strength (Athletics) or Dexterity (Acrobatics) check. If the grappled creature wins the contest, nothing happens. If the furnace golem wins the contest, the grappled creature is shoved into the furnace, where it is blinded and restrained. The trapped creature takes 13 ({@dice 2d8+4}) fire damage and gains one level of exhaustion at the start of each of its turns. The creature remains trapped until it uses an action to win an opposed Strength (Athletics) or Dexterity (Acrobatics) check against the furnace golem's Constitution check. Alternatively, a creature outside the furnace golem can attempt a Strength (Athletics) or Dexterity (Acrobatics) check against the golem's Constitution check to drag the trapped character free, but the rescuer automatically takes 13 ({@dice 2d8+4}) fire damage whether the attempt succeeds or fails. Only one creature of up to Medium size can be inside the golem's furnace.

***Heat.*** A furnace golem's entire form is extremely hot. Creatures that attack a furnace golem with unarmed attacks or with natural weapons take 4 ({@dice 1d8}) fire damage each time one of their attacks hits.

***Magic Resistance.*** A furnace golem has tactical advantage on saving throws versus spells and magical effects.

### Actions
***Multiattack.*** A furnace golem attacks twice with fists or once with flame breath. It can't attack with its fists while it has a creature grappled.

***Fist.*** Melee Attack: {@hit +10} to hit, reach 5 ft., one creature. Hit: 15 ({@dice 2d8+6}) bludgeoning damage plus {@dice 1d8} fire damage. If both attacks hit the same target, the target is grappled (see Furnace, above).

***Flame Breath (Recharge 6).*** Area Attack: automatic hit, 50 ft. line; creatures in line. Hit: 45 ({@dice 10d8}) fire damage, or half damage with a successful DC 16 Dexterity saving throw.

