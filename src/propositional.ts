// Primitives

type Theorem = string
type P = 'P'
type Q = 'Q'
type R = 'R'

type And<A extends Theorem, B extends Theorem> = `(${A}&${B})` 
type Or<A extends Theorem, B extends Theorem> = `(${A}|${B})`
type Implies<A extends Theorem, B extends Theorem> = `(${A}->${B})`
type Not<A extends Theorem> = `(~${A})`

// Axioms

const join = <A extends Theorem, B extends Theorem>(_: A, __: B) => <And<A, B>>({})
const sepLeft = <A extends Theorem, B extends Theorem>(_: And<A, B>) => <A>({})
const sepRight = <A extends Theorem, B extends Theorem>(_: And<A, B>) => <B>({})

const doubleTil = <A extends Theorem>(_: A) => <Not<Not<A>>>({})
const doubleTilRev = <A extends Theorem>(_: Not<Not<A>>) => <A>({})

const withPremise = <A extends Theorem, B extends Theorem>(_: (_: A) => B) => <Implies<A, B>>({})
const detach = <A extends Theorem, B extends Theorem>(_: A, __: Implies<A, B>) => <B>({})
const deMorgan = <A extends Theorem, B extends Theorem>(_: And<Not<A>, Not<B>>) => <Not<Or<A, B>>>({})
const contrapos = <A extends Theorem, B extends Theorem>(_: Implies<A, B>) => <Implies<Not<B>, Not<A>>>({})
const contraposRev = <A extends Theorem, B extends Theorem> (_: Implies<Not<B>, Not<A>>) => <Implies<A, B>>({})
const switcherooRev = <A extends Theorem, B extends Theorem>(_: Implies<Not<A>, B>) => <Or<A, B>>({})

// Let's test some theorems (if it compiles, the theorem is true)

const t1: '(P->(~(~P)))' = withPremise((p: P) => doubleTil(p))
const t2: Implies<And<P, Q>, And<Q, P>> = withPremise((pq: And<P, Q>) => join(sepRight(pq), sepLeft(pq)))
const t3: Implies<P, Implies<Q, And<P, Q>>> = withPremise((p: P) => withPremise((q: Q) => join(p, q)))

const theorem4: '(((P->Q)&((~P)->Q))->Q)' =
  withPremise((premise: And<Implies<P, Q>, Implies<Not<P>, Q>>) => {
    const a1 = sepLeft(premise)
    const a2 = contrapos(a1)
    const a3 = sepRight(premise)
    const a4 = contrapos(a3)

    const a5 = withPremise((premise2: '(~Q)') => {
      const b1 = detach(premise2, a2)
      const b2 = detach(premise2, a4)
      const b3 = join(b1, b2)
      return deMorgan(b3)
    })

    const a6 = contraposRev(a5)
    const a7 = withPremise((a: '(~P)') => a)
    const a8 = switcherooRev(a7)
    return detach(a8, a6)
  })
  