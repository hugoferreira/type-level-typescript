// Helpers
type NEq<A, B> = Eq<A, B> extends true ? false : true
type IsFalse<A extends false> = A

// From number define structure
type Tuplify<L extends number, T extends any[] = []> =
  T extends { length: L } ? T : Tuplify<L, [...T, any]>

// Constructor
type Join<A extends any[], B extends any[]> = [...A, ...B]

// A + B = C (infer C)
type Add<A extends number, B extends number> = Join<Tuplify<A>, Tuplify<B>> extends Tuplify<infer C> ? C : never

// A = B + C (infer C)
type Sub<A extends number, B extends number> = Tuplify<A> extends Join<Tuplify<B>, Tuplify<infer C>> ? C : never

// Usage
type Three = Tuplify<3> // = [any, any, any]
type Four  = Tuplify<4> // = [any, any, any, any]

type ThreeJoinFour = Join<Three, Four> // = [any, any, any, any, any, any, any]
type ThreePlusFour = Add<3, 7> // = 10
type SevenIsThreePlusFour = IsTrue<Eq<7, Add<3, 4>>>
type EightNotThreePlusFour = IsTrue<Eq<8, Add<3, 4>>>

type FiveMinusTwoIsThree = IsTrue<Eq<Sub<5, 2>, 3>>
type FiveMinusTwoNotFour = IsTrue<Eq<Sub<5, 2>, 4>>

// A < B -> A - 1 < B - 1
type BaseCase<A extends number, B extends number> = A extends 0 ? true : (B extends 0 ? true : false)
type Lt<A extends number, B extends number> =
  BaseCase<A, B> extends true ?
  (Eq<A, B> extends true ? false : A extends 0 ? true : false) :
  Lt<Sub<A, 1>, Sub<B, 1>>

type FiveLessThanSix = IsTrue<Lt<5, 6>>
type SizLessThanFive = IsFalse<Lt<6, 5>>

// type sumZeroIsNeutral<M extends number> = IsTrue<Eq<Add<0, M>, M>>

