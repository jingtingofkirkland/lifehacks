Above this article is a living thing: a stick figure whose brain is a tiny neural network — 43 numbers, all written by hand, no machine-learning library anywhere. At the start it knows nothing and mostly falls down. A few dozen generations later it hops up three stairs in a strict left → right → right order and lands on the finish platform. Nobody showed it how. This page explains exactly how that learning works: what the network sees, how its "brain score" (the fitness function) is defined, and how a genetic algorithm — not backpropagation — does the optimizing.

## How to play

- **▶ Start training** runs the whole population in parallel. The big orange figure is the one to watch: it is this generation's elite No. 1 — an exact clone of last generation's champion — and the camera stays locked on it for its entire run. The pale small figures are the rest of the population trying their own brains at the same time.
- The **overlay in the top-left of the canvas** (generation / best fitness ever / last generation's summit rate) shows the same numbers as the stat boxes, so you can watch the jumping and the learning at once.
- **⭐ Replay best** re-runs the best brain found so far. **🎲 Move the stairs** teleports the three steps to new (still reachable) positions and sends the reigning champion in *without any retraining* — the honest test of whether it learned a skill or memorized a route.
- Sliders change the experiment: **population size**, **mutation rate**, **platform width** (70–90px is "precision mode": wide platforms forgive lucky jumps, narrow ones don't), **playback speed**, and the **hidden-layer size** (direct connection / 4 / 6 / 12 neurons).

## The world: a physics problem with hard limits

The world is deliberately small and completely deterministic. Gravity pulls at 1500 px/s²; a jump leaves the ground at 640 px/s vertically, and the network's output adds up to ±260 px/s horizontally. Those numbers imply a hard capability boundary that no brain, however clever, can exceed:

- **Maximum jump height ≈ 137 px** (640² / (2 × 1500))
- **Air time ≈ 0.85 s**, so **maximum jump distance ≈ 222 px**

The three stairs form a zigzag above the start platform — left, then right, then right — each rising only 70–75 px with centers offset by roughly 180–190 px: comfortably reachable in one honest jump. Skipping a step is physically blocked: from the start platform to stair 2 is a 140 px rise (more than 137), and from stair 1 to stair 3 is both too far and too high. The sequence is enforced by geometry, not by a rule the network could game.

One deliberate imperfection: **every figure's spawn point is jittered by ±20 px every generation**, champions included. A champion clone therefore never replays an identical trajectory — it is re-tested from a slightly different start each time, and evolution ends up selecting brains that tolerate that jitter.

## The brain: 5 inputs, 1 output, 43 numbers

Every moment, the network receives exactly **five inputs — all relative quantities**, never absolute coordinates:

1. Horizontal distance to the *current target* stair's center
2. Vertical height difference to that target
3. Its own horizontal velocity
4. Its own vertical velocity
5. Whether it is standing on the ground (so it knows it *can* jump)

The optional hidden layer (0 / 4 / 6 / 12 neurons, tanh activation) mixes these signals, and a single output neuron produces one number:

- **|output| > 0.15** → jump (below that, stay put)
- **Sign** → direction (positive = right, negative = left)
- **Magnitude** → horizontal impulse (output × 260 px/s)

The total number of learnable parameters is **7 × hidden + 1**: 6 with no hidden layer, 29 with 4, 43 with 6 (the default: 36 weights + 7 biases), 85 with 12. That handful of numbers *is* the entire skill. Everything the figure "knows" about jumping lives in them.

Because the inputs are relative — "the next step is this far left and this high" — the network cannot memorize a route. What it can learn is a **feedback policy**: a reaction rule that reads the current situation and answers with a jump. That is what makes the 🎲 moved-stairs exam passable at all, and it is also the limit of the generalization: change the gravity, or move the stairs outside the distribution it trained in, and the policy breaks. It learned to respond, not physics.

## One output, three jobs: direction, trigger, and force

A single number seems too little to steer a jump with — until you notice it is doing three jobs at once. The output neuron's value (after tanh, so always between −1 and 1) is read three different ways:

- **Sign = direction.** Negative pushes left, positive pushes right.
- **Threshold = the jump trigger.** Only when |output| > 0.15 does the figure leave the ground at all; a small output means "not yet," which gives the network a way to *wait* — for example until it has walked or slid into a better spot.
- **Magnitude = horizontal force.** The horizontal velocity is output × 260 px/s, so 0.2 is a cautious hop sideways and 0.95 is a full-commit launch.

What the network does **not** control is height: the vertical launch speed is a fixed 640 px/s written into the physics, identical for every jump. So the entire learnable skill is *when to jump, which way to lean, and how hard* — jump height is a law of this world, not a decision. That is a deliberate simplification, and it doubles as the capability boundary discussed above: because vertical speed never varies, the ≈137 px ceiling is a property of the world, and the network's job is purely to spend its fixed jump well.

> A bug worth confessing, because a reader of the live demo caught it: an early build of this very toy triggered jumps only when the output was **greater than** +0.15. The sign was silently eaten — the figure could only ever jump right, and since stair 1 is to the left, the population plateaued forever. The fix was one character of thinking: trigger on the **absolute value**, let the sign do its job. If your own version "never learns," check the trigger before you blame the algorithm.

## The fitness function: the real teacher

A genetic algorithm is only as smart as the score you hand it. Each figure runs one life (at most 8 seconds; a run also ends early after 2.5 s without improvement) and is scored:

**fitness = stairs climbed × 10 + approach progress × 9 + summit bonus 30 − jumps × 0.05**

- **Stairs climbed × 10** rewards the actual goal, one step at a time.
- **Approach progress (0–9)** measures how much closer the figure ever got to its next target (Manhattan distance, scaled). This is the most important term for learning: without it, a figure that jumps bravely toward stair 1 and falls scores the same zero as one that never moves, and evolution has no gradient of "warmer / colder" to follow. The progress term turns a needle-in-a-haystack search into a slope that can be climbed.
- **Summit bonus 30** makes finishing decisively better than almost-finishing.
- **−0.05 per jump** is a tiny tax on flailing: among two figures that climb equally well, the calmer jumper wins.

The theoretical ceiling is just under 69 (3 × 10 + 9 + 30, minus a few jump taxes) — when the orange best-fitness curve flattens near there, it has not stalled; it has arrived.

## Shaping without traps: why standing still is not a local optimum

Now a sharp question about that fitness function. Stair 1 is to the **left**, away from the finish. Doesn't the approach-progress term punish the correct first move — and shouldn't evolution settle for the lazy local optimum of just standing still?

It would, if the score were defined naively. Three design choices prevent it:

1. **The target pointer is the *next* stair, not the finish.** Both network inputs (distance, height difference) and the progress term point at the next unclimbed stair; only when the figure lands on it does the pointer advance. From the figure's point of view there is no "away from the finish" — jumping left toward stair 1 *is* walking toward its target. The environment decomposes the route into subgoals, and the agent only ever has to solve one hop at a time.
2. **Progress is a ratchet.** The score uses `bestProg` — the closest the figure *ever* got to its current target during its life, which only increases. Jump toward the stair, overshoot, fall back: the earned progress is not handed back. Exploration toward the target can never be a net loss.
3. **Milestones outrank shaping.** The approach term caps out below +9, while landing on a stair pays +10 and the summit +30. This ordering is a general rule of reward shaping: the shaping gradient may guide, but real achievements must always be worth more than the maximum guidance bonus — otherwise agents learn to farm the guidance instead of doing the task.

With those in place, standing still is simply a bad strategy: it keeps only its spawn-point progress (roughly 6 points, no milestone, minus nothing — and nothing more, ever), and by generation 2 or 3 any individual that hops a little closer to stair 1 beats it and takes its breeding slots. Standing still is not a local optimum; it is just an early loser.

The counterfactual shows what the shaping is protecting against. Score only the distance to the *finish* and the geometry turns hostile: the best reachable position is the wall directly below the finish platform, every correct move (left, toward stair 1) initially *increases* the measured distance and gets punished, and the population piles up under the finish, polishing a strategy that can never score a single stair. Most "my agent learned to do nothing" stories in reinforcement learning are exactly this bug — a score function whose local gradient points away from the global solution. Subgoal pointers, ratchets, and milestone-dominant rewards are how you design your way out of it.

## The optimizer: a genetic algorithm, step by step

There is no backpropagation in this toy. Each generation works like this:

1. **Run everyone.** The whole population (default 40) plays in parallel with its own random-at-first brain.
2. **Score everyone** with the fitness function above.
3. **Elites survive.** The top 3 brains are copied unchanged into the next generation. This guarantees the best score never goes backwards — the all-time best curve is monotonic by construction.
4. **Roulette-wheel parent selection.** Everyone else is bred from parents chosen with probability proportional to fitness (with a +5 smoothing so even weak figures keep a small chance — their genes occasionally carry a useful mutation).
5. **Crossover.** Each weight of a child is picked coin-flip from one of its two parents.
6. **Mutation.** Each weight then, with probability = the mutation rate (default 12%), gets a kick of Gaussian noise. This is the only source of genuinely new behavior — and the reason the population never fully settles.

Repeat for a few dozen generations and the champion usually goes from "falls off the start platform" to reliably summiting. What you watch in the chart is two curves: **orange = best fitness each generation**, **green = that generation's summit rate** (the share of the whole population that reached the top). The green curve matters more, as the next sections explain.

## Why not backpropagation? Genetic algorithms vs. gradient descent

This is the first question everyone asks, and it deserves a precise answer: **backpropagation cannot run here at all** — not "it would be slower," it is undefined for this problem.

Backpropagation needs a *differentiable* objective: a smooth loss function whose slope with respect to every single weight can be computed, so each weight learns "move a little this way and the error shrinks." Here there is no such function. The fitness score is one number handed out after a physics simulation finishes, and between the weights and that number sit a pile of discrete events: a jump triggers or it doesn't (|output| vs. the 0.15 threshold), a landing registers or it doesn't, a stair counter clicks from 1 to 2. There is no derivative through "the foot either touched the platform or missed it," and no per-weight error signal to propagate back. No gradient exists to descend.

That single fact explains the whole division of labor in machine learning:

| | Backpropagation / gradient descent | Genetic algorithm |
| --- | --- | --- |
| Needs | A differentiable loss and an explicit error signal | Only a score — any score |
| Information per attempt | Every weight gets its own correction direction in one pass | One lifetime earns exactly one number |
| Sample efficiency | Very high | Low — most individuals exist to be eliminated |
| Scaling | The only known way to train millions to trillions of parameters; random mutation in that dimensionality essentially never improves anything | Works in the tens-to-thousands of parameters; by ~10k parameters it is effectively dead |
| Guarantees | Converges (to a local optimum) under known conditions | No convergence guarantee; the best-so-far is kept, that is all |
| Where it wins | Labeled data, differentiable objectives — i.e. modern deep learning | Black-box environments, discrete decisions, sparse win/lose feedback, non-differentiable simulators |

So the honest one-liner is: **a genetic algorithm is not faster than backpropagation; it is what remains usable when no gradient exists.** Where gradients exist, gradient descent wins by an enormous margin, and it is not close — that is why every large model you have heard of is trained with backpropagation, full stop.

The genetic algorithm's genuine advantages are different ones: it needs *nothing* but a score, so it works in black-box, discrete, only-final-outcome settings; it is simple enough to write in an afternoon and transparent enough to explain on one page; and a population explores in parallel by construction. Its costs are just as real: one individual trades its whole life for a single number (terrible information efficiency), and the method collapses as the parameter count grows.

The applicability map is therefore short:

- **Labels or a differentiable loss available → backpropagation.**
- **Only a score, and an environment you cannot differentiate through (games, simulators, physical experiments, discrete structure search) → the evolution / reinforcement-learning family.** Modern game AI usually reaches for reinforcement learning such as PPO, which is a cousin of what happens here: it, too, learns from scores rather than derivatives of a known loss.
- **This toy** — 43 parameters, a non-differentiable physics world, and a teaching goal — sits squarely in genetic-algorithm territory. Using one here is not a compromise; it is the appropriate tool, and at this scale it is also the *legible* one: you can watch selection happen.

## Learning, or just lucky? How to tell

A first summit in generation 2 or 3 proves almost nothing: with 40 random brains and wide platforms, one or two are usually born close to "can jump." Luck gets the first summit; it cannot manufacture the following evidence:

1. **The summit rate climbs.** If the green curve rises from 0% toward tens of percent across generations, the "can jump" trait is spreading through the population — that is convergence, not a lottery ticket.
2. **The champion passes re-tests.** Every generation restarts the champion clone from a ±20 px jittered spawn. Repeated summits from shifted starts mean a policy, not a trajectory. The ⭐ replay and the 🎲 moved-stairs exam push this further: same brain, new terrain, no retraining.
3. **It survives precision mode.** Narrow the platforms to 70–90 px and luck mostly evaporates — landing spots must actually be aimed. A brain that keeps summiting (and a rate that keeps rising) on narrow platforms has the aiming *in its parameters*.

Also expect improvement to change shape over time: best fitness saturates near the ~69 ceiling fairly early, and afterwards what improves is the *rate* and the smoothness — fewer wasted jumps, less hesitation. "Getting better" mostly means "succeeding more often," not "scoring higher."

## Why does most of the population still fail every generation?

Because the population is not a graduating class; it is a **search cloud**. Only the top 3 figures are carried over unchanged. The other ~37 are fresh children of crossover plus mutation — deliberately scrambled variations on their parents. Most variations are worse than the original, so most children fail, every generation, by design. Those failures are the exploration budget: they are the price of occasionally producing a child that jumps *better* than either parent. If instead every figure were a copy of the champion, the summit rate would look perfect and learning would stop on the spot — a brittle monoculture that collapses the first time the stairs move. Judge the system by its champion and its rate curve, never by the average figure's dignity.

## How was the hidden-layer size chosen?

Honestly: there is no formula and no theorem. The field runs on rules of thumb plus trial and error — the hidden layer must be wide enough to express the policy ("if the target is up-left and I'm grounded, jump left, gently") and narrow enough that evolution can still find good values for every parameter by random search. This page makes that tradeoff tangible instead of theoretical: switch between 0 / 4 / 6 / 12 and watch which learns fastest. The direct-connection version (0 hidden, 6 parameters) often learns surprisingly well, because the task's reaction rule is nearly linear; the 12-neuron version (85 parameters) can express more, but evolution has 85 numbers to get right instead of 43, and may well learn *slower*. More capacity is more potential and more search cost, in equal measure.

## Experiments to try

- **Mutation rate 40% vs. 2%.** At 40% the population learns fast and keeps "unlearning" — watch the summit rate jitter. At 2% it is stable but slow: crossover shuffles existing genes and almost nothing new appears.
- **Platform width 70 px.** Precision mode. Compare how many generations the first summit takes, and what the green curve does.
- **Population 10 vs. 120.** Ten figures is a lottery with few tickets; 120 explores broadly but each generation takes longer to watch. Bigger is more reliable, not infinitely better.
- **Hidden layer 0 vs. 12** on identical settings, and compare generations-to-first-summit.
- **Train to a stable champion, then 🎲 exam it repeatedly.** Each exam moves the stairs differently; a champion that passes three exams in a row has earned the word "learned."

## Honest boundaries

- The network is a real neural network (weighted sums, tanh, one output), and the evolution is a real genetic algorithm — but this is a teaching toy, not deep learning. Nobody trains production models this way at scale, for the scaling reasons above.
- There is **no convergence guarantee**: elitism guarantees the *recorded best* never decreases; it does not guarantee a summit by any deadline, or at all, on unlucky runs. Reset and run it again — variance between runs is itself one of the lessons.
- The policy generalizes across *positions* (thanks to relative inputs, jittered spawns, and the moved-stairs exam), not across *physics*. Change gravity or jump power and the same brain fails immediately: it internalized responses calibrated to this world, not an understanding of projectile motion.
- Everything runs locally in your browser tab. No data leaves the page; refreshing resets the population to generation 1.
