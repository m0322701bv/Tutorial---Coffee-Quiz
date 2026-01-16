# Coffee Personality Quiz - Requirements

## Personality → Coffee Pairings (5 Results)

| Personality | Coffee | Tagline |
|-------------|--------|---------|
| Bold Adventurer | Double Espresso | "You live for intensity" |
| Sweet Enthusiast | Caramel Latte | "Life's too short for bitter" |
| Zen Minimalist | Black Coffee, Single Origin | "Simple. Clean. Perfect." |
| Health Nut | Oat Milk Americano | "Wellness in every sip" |
| Indulgent Treat | Mocha with Whip | "Coffee is dessert" |

## Result Display

**Style:** Show all percentages with all coffee recommendations
- Example: "You're 50% Bold Adventurer, 30% Zen Minimalist, 20% Sweet Enthusiast"
- Users see their full breakdown and can explore all their matching coffees

## Visual Style

**Theme:** Warm & Cozy
- Earth tones and soft browns
- Coffee-shop feel
- Soft gradients
- Serif headings (Playfair Display style)
- Rounded, inviting elements
- Cream/warm white backgrounds

## Images

Coffee images included for each result:
- `public/images/espresso.jpg` - Bold Adventurer
- `public/images/caramel-latte.jpg` - Sweet Enthusiast
- `public/images/black-coffee.jpg` - Zen Minimalist
- `public/images/oat-milk-americano.jpg` - Health Nut
- `public/images/mocha.jpg` - Indulgent Treat

## Icons

**Include icons** next to each answer option for visual polish.

## Quiz Questions (6 Total)

### Q1: It's Saturday morning. What's your vibe?
| Answer | Icon | Maps To |
|--------|------|---------|
| Already at the gym or on a hike | 🏃 | Health Nut |
| Slow morning with a book and silence | 📖 | Zen Minimalist |
| Making an elaborate brunch | 🥞 | Indulgent Treat |
| Tackling my to-do list with intensity | 🎯 | Bold Adventurer |
| Cozy on the couch with something sweet | 🛋️ | Sweet Enthusiast |

### Q2: Pick a vacation style:
| Answer | Icon | Maps To |
|--------|------|---------|
| Adventure trip - hiking, exploring, pushing limits | 🏔️ | Bold Adventurer |
| All-inclusive resort with endless desserts | 🏖️ | Indulgent Treat |
| Wellness retreat - yoga, meditation, clean eating | 🧘 | Health Nut |
| Quiet cabin in the woods, no agenda | 🏡 | Zen Minimalist |
| Theme park with friends and treats | 🎡 | Sweet Enthusiast |

### Q3: Which Netflix genre do you reach for?
| Answer | Icon | Maps To |
|--------|------|---------|
| Intense thriller or action | 🔥 | Bold Adventurer |
| Feel-good rom-com | 🍰 | Sweet Enthusiast |
| Thought-provoking documentary | 🧠 | Zen Minimalist |
| Health & wellness shows | 🥗 | Health Nut |
| Baking competitions or food shows | 🍫 | Indulgent Treat |

### Q4: Pick a superpower:
| Answer | Icon | Maps To |
|--------|------|---------|
| Super strength | ⚡ | Bold Adventurer |
| Perfect inner peace, always | 🧘 | Zen Minimalist |
| Everything you touch becomes delicious | 🍬 | Indulgent Treat |
| Peak physical health forever | 💪 | Health Nut |
| Make anyone smile instantly | 💖 | Sweet Enthusiast |

### Q5: Your friends would describe you as:
| Answer | Icon | Maps To |
|--------|------|---------|
| Intense and driven | 🔥 | Bold Adventurer |
| Sweet and caring | 🌸 | Sweet Enthusiast |
| Calm and grounded | 🌿 | Zen Minimalist |
| Health-conscious and active | 🏋️ | Health Nut |
| Fun and indulgent | 🎂 | Indulgent Treat |

### Q6: Pick a dessert:
| Answer | Icon | Maps To |
|--------|------|---------|
| Triple chocolate lava cake | 🍫 | Indulgent Treat |
| Fresh fruit with a little honey | 🍓 | Health Nut |
| Dark chocolate, 85% cacao | ☕ | Bold Adventurer |
| Classic vanilla ice cream | 🍦 | Sweet Enthusiast |
| Nothing, I'm good | 🍵 | Zen Minimalist |

## Logic Summary

1. User answers 6 questions
2. Each answer adds a point to one personality type
3. At the end, calculate percentages for each personality
4. Display results showing all percentages and corresponding coffee recommendations
5. Primary result (highest percentage) is featured prominently
