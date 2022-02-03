// Helpers
type EqualsWrapped<T> = T extends infer R & {} ? { [P in keyof R]: R[P] } : never
type Eq<A, B> = (<T>() => T extends EqualsWrapped<A> ? 1 : 2) extends
                (<T>() => T extends EqualsWrapped<B> ? 1 : 2) ? true : false
type IsTrue<A extends true> = A

// Peano Arithmetic
type Nat = 0 | Succ<any>
type Succ<N extends Nat> = { succ: N }

// Peano from Tuples 
type ToNat<L extends number, T extends any[] = [], N extends Nat = 0> =
  T['length'] extends L ? N : ToNat<L, [...T, any], Succ<N>>

// Arithmetic Operators
type Sum<A extends Nat, B extends Nat> = A extends Succ<infer N> ? Sum<N, Succ<B>> : B
type Diff<A extends Nat, B extends Nat> = A extends Sum<B, infer C> ? C : never

// @ts-ignore Type-Level to/from string
type StringFromNat<A extends Nat> = A extends Succ<infer N> ? `S${StringFromNat<N>}` : '0' 
type NatFromString<A extends string> = A extends '0' ? 0 : A extends `S${infer R}` ? Succ<NatFromString<R>> : never

// Tests
type _0 = 0
type _1 = Succ<_0>
type _2 = Succ<_1>
type _4 = Sum<_2, _2>
type _6 = Sum<_2, _4>
type _5 = Diff<_6, _1>

type _2S = StringFromNat<_2>  // SS0
type _4S = StringFromNat<_4>  // SSSS0
type _5S = IsTrue<Eq<StringFromNat<_5>, 'SSSSS0'>>
type _6S = IsTrue<Eq<StringFromNat<_6>, 'SSSSSS0'>>

type _SSSSS0is5 = IsTrue<Eq<_5, ToNat<5>>>
type _SSSSS0as5 = IsTrue<Eq<ToNat<5>, NatFromString<'SSSSS0'>>>

type sumZeroIsNeutral<M extends Nat> = IsTrue<Eq<Sum<0, M>, M>> // = true, QED!
