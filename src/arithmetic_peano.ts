// Helpers
type EqualsWrapped<T> = T extends infer R & {} ? { [P in keyof R]: R[P] } : never
type Eq<A, B> = (<T>() => T extends EqualsWrapped<A> ? 1 : 2) extends
                (<T>() => T extends EqualsWrapped<B> ? 1 : 2) ? true : false
type IsTrue<A extends true> = A

// Peano Arithmetic
type Nat = 0 | Succ<any>
type Succ<N extends Nat> = { succ: N }

// Arithmetic Operators
type Sum<A extends Nat, B extends Nat> = A extends Succ<infer N> ? Sum<N, Succ<B>> : B
type Diff<A extends Nat, B extends Nat> = A extends Sum<B, infer C> ? C : never

// @ts-ignore Type-Level toString
type StringOfNat<A extends Nat> = A extends Succ<infer N> ? `S${StringOfNat<N>}` : `0` 

// Tests
type _0 = 0
type _1 = Succ<_0>
type _2 = Succ<_1>
type _4 = Sum<_2, _2>
type _6 = Sum<_2, _4>
type _5 = Diff<_6, _1>

type _2S = StringOfNat<_2>  // SS0
type _4S = StringOfNat<_4>  // SSSS0
type _5S = IsTrue<Eq<StringOfNat<_5>, "SSSSS0">>
type _6S = IsTrue<Eq<StringOfNat<_6>, "SSSSSS0">>

type sumZeroIsNeutral<M extends Nat> = IsTrue<Eq<Sum<0, M>, M>>     // = true, QED!

