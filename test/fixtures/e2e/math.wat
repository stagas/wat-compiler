(module
  (type $t0 (func (param f32) (result f32)))
  (type $t1 (func (param f32 f32) (result f32)))
  (type $t2 (func (param f64) (result i32)))
  (type $t3 (func (result f64)))
  (type $t4 (func (param i64) (result i64)))
  (type $t5 (func (param i32) (result i32)))
  (type $t6 (func (result f32)))
  (type $t7 (func (param f32) (result i32)))
  (import "env" "seed" (func $env.seed (type $t3)))
  (func $abs (export "abs") (type $t0) (param $p0 f32) (result f32)
    (f32.abs
      (local.get $p0)))
  (func $f2 (type $t0) (param $p0 f32) (result f32)
    (f32.div
      (f32.mul
        (local.get $p0)
        (f32.add
          (f32.mul
            (local.get $p0)
            (f32.add
              (f32.mul
                (local.get $p0)
                (f32.const -0x1.1ba6d6p-7 (;=-0.00865636;)))
              (f32.const -0x1.5e2774p-5 (;=-0.0427434;))))
          (f32.const 0x1.5554eap-3 (;=0.166666;))))
      (f32.add
        (f32.mul
          (local.get $p0)
          (f32.const -0x1.69cb5cp-1 (;=-0.70663;)))
        (f32.const 0x1p+0 (;=1;)))))
  (func $f3 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 f32) (local $l4 f32)
    (if $I0
      (i32.ge_u
        (local.tee $l1
          (i32.and
            (local.tee $l2
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 2147483647)))
        (i32.const 1065353216))
      (then
        (if $I1
          (i32.eq
            (local.get $l1)
            (i32.const 1065353216))
          (then
            (return
              (select
                (f32.const 0x1.921fb4p+1 (;=3.14159;))
                (f32.const 0x0p+0 (;=0;))
                (i32.lt_s
                  (local.get $l2)
                  (i32.const 0))))))
        (return
          (f32.div
            (f32.const 0x0p+0 (;=0;))
            (f32.sub
              (local.get $p0)
              (local.get $p0))))))
    (if $I2
      (i32.lt_u
        (local.get $l1)
        (i32.const 1056964608))
      (then
        (if $I3
          (i32.le_u
            (local.get $l1)
            (i32.const 847249408))
          (then
            (return
              (f32.const 0x1.921fb4p+0 (;=1.5708;)))))
        (return
          (f32.sub
            (f32.const 0x1.921fb4p+0 (;=1.5708;))
            (f32.sub
              (local.get $p0)
              (f32.sub
                (f32.const 0x1.4442dp-24 (;=7.54979e-08;))
                (f32.mul
                  (local.get $p0)
                  (call $f2
                    (f32.mul
                      (local.get $p0)
                      (local.get $p0))))))))))
    (if $I4
      (i32.lt_s
        (local.get $l2)
        (i32.const 0))
      (then
        (return
          (f32.mul
            (f32.sub
              (f32.const 0x1.921fb4p+0 (;=1.5708;))
              (f32.add
                (local.tee $l3
                  (f32.sqrt
                    (local.tee $p0
                      (f32.add
                        (f32.mul
                          (local.get $p0)
                          (f32.const 0x1p-1 (;=0.5;)))
                        (f32.const 0x1p-1 (;=0.5;))))))
                (f32.sub
                  (f32.mul
                    (call $f2
                      (local.get $p0))
                    (local.get $l3))
                  (f32.const 0x1.4442dp-24 (;=7.54979e-08;)))))
            (f32.const 0x1p+1 (;=2;))))))
    (f32.mul
      (f32.add
        (local.tee $p0
          (f32.reinterpret_i32
            (i32.and
              (i32.reinterpret_f32
                (local.tee $l4
                  (f32.sqrt
                    (local.tee $l3
                      (f32.sub
                        (f32.const 0x1p-1 (;=0.5;))
                        (f32.mul
                          (local.get $p0)
                          (f32.const 0x1p-1 (;=0.5;))))))))
              (i32.const -4096))))
        (f32.add
          (f32.mul
            (call $f2
              (local.get $l3))
            (local.get $l4))
          (f32.div
            (f32.sub
              (local.get $l3)
              (f32.mul
                (local.get $p0)
                (local.get $p0)))
            (f32.add
              (local.get $l4)
              (local.get $p0)))))
      (f32.const 0x1p+1 (;=2;))))
  (func $acos (export "acos") (type $t0) (param $p0 f32) (result f32)
    (call $f3
      (local.get $p0)))
  (func $f5 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 f32) (local $l4 f32) (local $l5 i32) (local $l6 i32)
    (local.set $l5
      (i32.const 1))
    (if $I0
      (i32.or
        (i32.shr_u
          (local.tee $l6
            (i32.reinterpret_f32
              (local.get $p0)))
          (i32.const 31))
        (i32.lt_u
          (local.get $l6)
          (i32.const 1054086096)))
      (then
        (if $I1
          (i32.ge_u
            (local.get $l6)
            (i32.const -1082130432))
          (then
            (if $I2
              (f32.eq
                (local.get $p0)
                (f32.const -0x1p+0 (;=-1;)))
              (then
                (return
                  (f32.div
                    (local.get $p0)
                    (f32.const 0x0p+0 (;=0;))))))
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (if $I3
          (i32.lt_u
            (i32.shl
              (local.get $l6)
              (i32.const 1))
            (i32.const 1728053248))
          (then
            (return
              (local.get $p0))))
        (local.set $l1
          (if $I4 (result f32)
            (i32.le_u
              (local.get $l6)
              (i32.const -1097468391))
            (then
              (local.set $l5
                (i32.const 0))
              (local.get $p0))
            (else
              (f32.const 0x0p+0 (;=0;))))))
      (else
        (if $I5
          (i32.ge_u
            (local.get $l6)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0))))))
    (if $I6
      (local.get $l5)
      (then
        (local.set $l2
          (if $I7 (result f32)
            (i32.lt_s
              (local.tee $l5
                (i32.sub
                  (i32.shr_u
                    (local.tee $l6
                      (i32.add
                        (i32.reinterpret_f32
                          (local.tee $l1
                            (f32.add
                              (local.get $p0)
                              (f32.const 0x1p+0 (;=1;)))))
                        (i32.const 4913933)))
                    (i32.const 23))
                  (i32.const 127)))
              (i32.const 25))
            (then
              (f32.div
                (select
                  (f32.sub
                    (f32.const 0x1p+0 (;=1;))
                    (f32.sub
                      (local.get $l1)
                      (local.get $p0)))
                  (f32.sub
                    (local.get $p0)
                    (f32.sub
                      (local.get $l1)
                      (f32.const 0x1p+0 (;=1;))))
                  (i32.ge_s
                    (local.get $l5)
                    (i32.const 2)))
                (local.get $l1)))
            (else
              (f32.const 0x0p+0 (;=0;)))))
        (local.set $l1
          (f32.sub
            (f32.reinterpret_i32
              (i32.add
                (i32.and
                  (local.get $l6)
                  (i32.const 8388607))
                (i32.const 1060439283)))
            (f32.const 0x1p+0 (;=1;))))))
    (local.set $l4
      (f32.mul
        (local.tee $p0
          (f32.mul
            (local.tee $l3
              (f32.div
                (local.get $l1)
                (f32.add
                  (local.get $l1)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $l3)))
        (local.get $p0)))
    (f32.add
      (f32.add
        (f32.sub
          (f32.add
            (f32.mul
              (local.get $l3)
              (f32.add
                (local.tee $l3
                  (f32.mul
                    (f32.mul
                      (local.get $l1)
                      (f32.const 0x1p-1 (;=0.5;)))
                    (local.get $l1)))
                (f32.add
                  (f32.mul
                    (local.get $p0)
                    (f32.add
                      (f32.mul
                        (local.get $l4)
                        (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                      (f32.const 0x1.555554p-1 (;=0.666667;))))
                  (f32.mul
                    (local.get $l4)
                    (f32.add
                      (f32.mul
                        (local.get $l4)
                        (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                      (f32.const 0x1.999c26p-2 (;=0.40001;)))))))
            (f32.add
              (f32.mul
                (local.tee $p0
                  (f32.convert_i32_s
                    (local.get $l5)))
                (f32.const 0x1.2fefa2p-17 (;=9.058e-06;)))
              (local.get $l2)))
          (local.get $l3))
        (local.get $l1))
      (f32.mul
        (local.get $p0)
        (f32.const 0x1.62e3p-1 (;=0.693138;)))))
  (func $f6 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32)
    (if $I0
      (i32.or
        (local.tee $l2
          (i32.shr_u
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (i32.lt_u
          (local.get $l1)
          (i32.const 8388608)))
      (then
        (if $I1
          (i32.eqz
            (i32.shl
              (local.get $l1)
              (i32.const 1)))
          (then
            (return
              (f32.div
                (f32.const -0x1p+0 (;=-1;))
                (f32.mul
                  (local.get $p0)
                  (local.get $p0))))))
        (if $I2
          (local.get $l2)
          (then
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (local.set $l3
          (i32.const -25))
        (local.set $l1
          (i32.reinterpret_f32
            (f32.mul
              (local.get $p0)
              (f32.const 0x1p+25 (;=3.35544e+07;))))))
      (else
        (if $I3
          (i32.ge_u
            (local.get $l1)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0)))
          (else
            (if $I4
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))
              (then
                (return
                  (f32.const 0x0p+0 (;=0;)))))))))
    (local.set $l6
      (f32.mul
        (local.tee $l4
          (f32.mul
            (local.tee $l5
              (f32.div
                (local.tee $p0
                  (f32.sub
                    (f32.reinterpret_i32
                      (i32.add
                        (i32.and
                          (local.tee $l1
                            (i32.add
                              (local.get $l1)
                              (i32.const 4913933)))
                          (i32.const 8388607))
                        (i32.const 1060439283)))
                    (f32.const 0x1p+0 (;=1;))))
                (f32.add
                  (local.get $p0)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $l5)))
        (local.get $l4)))
    (f32.add
      (f32.add
        (f32.sub
          (f32.add
            (f32.mul
              (local.get $l5)
              (f32.add
                (local.tee $l5
                  (f32.mul
                    (f32.mul
                      (local.get $p0)
                      (f32.const 0x1p-1 (;=0.5;)))
                    (local.get $p0)))
                (f32.add
                  (f32.mul
                    (local.get $l4)
                    (f32.add
                      (f32.mul
                        (local.get $l6)
                        (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                      (f32.const 0x1.555554p-1 (;=0.666667;))))
                  (f32.mul
                    (local.get $l6)
                    (f32.add
                      (f32.mul
                        (local.get $l6)
                        (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                      (f32.const 0x1.999c26p-2 (;=0.40001;)))))))
            (f32.mul
              (local.tee $l4
                (f32.convert_i32_s
                  (i32.add
                    (local.get $l3)
                    (i32.sub
                      (i32.shr_u
                        (local.get $l1)
                        (i32.const 23))
                      (i32.const 127)))))
              (f32.const 0x1.2fefa2p-17 (;=9.058e-06;))))
          (local.get $l5))
        (local.get $p0))
      (f32.mul
        (local.get $l4)
        (f32.const 0x1.62e3p-1 (;=0.693138;)))))
  (func $acosh (export "acosh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32)
    (block $B0 (result f32)
      (if $I1
        (i32.lt_u
          (i32.and
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 2147483647))
          (i32.const 1073741824))
        (then
          (br $B0
            (call $f5
              (f32.add
                (local.tee $p0
                  (f32.sub
                    (local.get $p0)
                    (f32.const 0x1p+0 (;=1;))))
                (f32.sqrt
                  (f32.mul
                    (local.get $p0)
                    (f32.add
                      (local.get $p0)
                      (f32.const 0x1p+1 (;=2;))))))))))
      (if $I2
        (i32.lt_u
          (local.get $l1)
          (i32.const 1166016512))
        (then
          (br $B0
            (call $f6
              (f32.sub
                (f32.add
                  (local.get $p0)
                  (local.get $p0))
                (f32.div
                  (f32.const 0x1p+0 (;=1;))
                  (f32.add
                    (local.get $p0)
                    (f32.sqrt
                      (f32.sub
                        (f32.mul
                          (local.get $p0)
                          (local.get $p0))
                        (f32.const 0x1p+0 (;=1;)))))))))))
      (f32.add
        (call $f6
          (local.get $p0))
        (f32.const 0x1.62e43p-1 (;=0.693147;)))))
  (func $asin (export "asin") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 f32) (local $l3 f64)
    (block $B0 (result f32)
      (if $I1
        (i32.ge_u
          (local.tee $l1
            (i32.and
              (i32.reinterpret_f32
                (local.get $p0))
              (i32.const 2147483647)))
          (i32.const 1065353216))
        (then
          (drop
            (br_if $B0
              (f32.add
                (f32.mul
                  (local.get $p0)
                  (f32.const 0x1.921fb6p+0 (;=1.5708;)))
                (f32.const 0x1p-120 (;=7.52316e-37;)))
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))))
          (br $B0
            (f32.div
              (f32.const 0x0p+0 (;=0;))
              (f32.sub
                (local.get $p0)
                (local.get $p0))))))
      (if $I2
        (i32.lt_u
          (local.get $l1)
          (i32.const 1056964608))
        (then
          (drop
            (br_if $B0
              (local.get $p0)
              (i32.and
                (i32.lt_u
                  (local.get $l1)
                  (i32.const 964689920))
                (i32.ge_u
                  (local.get $l1)
                  (i32.const 8388608)))))
          (br $B0
            (f32.add
              (local.get $p0)
              (f32.mul
                (local.get $p0)
                (call $f2
                  (f32.mul
                    (local.get $p0)
                    (local.get $p0))))))))
      (f32.copysign
        (f32.demote_f64
          (f64.sub
            (f64.const 0x1.921fb6p+0 (;=1.5708;))
            (f64.mul
              (f64.add
                (local.tee $l3
                  (f64.sqrt
                    (f64.promote_f32
                      (local.tee $l2
                        (f32.sub
                          (f32.const 0x1p-1 (;=0.5;))
                          (f32.mul
                            (f32.abs
                              (local.get $p0))
                            (f32.const 0x1p-1 (;=0.5;))))))))
                (f64.mul
                  (local.get $l3)
                  (f64.promote_f32
                    (call $f2
                      (local.get $l2)))))
              (f64.const 0x1p+1 (;=2;)))))
        (local.get $p0))))
  (func $asinh (export "asinh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 f32)
    (local.set $l2
      (f32.reinterpret_i32
        (local.tee $l1
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647)))))
    (f32.copysign
      (if $I0 (result f32)
        (i32.ge_u
          (local.get $l1)
          (i32.const 1166016512))
        (then
          (f32.add
            (call $f6
              (local.get $l2))
            (f32.const 0x1.62e43p-1 (;=0.693147;))))
        (else
          (if $I1 (result f32)
            (i32.ge_u
              (local.get $l1)
              (i32.const 1073741824))
            (then
              (call $f6
                (f32.add
                  (f32.add
                    (local.get $l2)
                    (local.get $l2))
                  (f32.div
                    (f32.const 0x1p+0 (;=1;))
                    (f32.add
                      (f32.sqrt
                        (f32.add
                          (f32.mul
                            (local.get $l2)
                            (local.get $l2))
                          (f32.const 0x1p+0 (;=1;))))
                      (local.get $l2))))))
            (else
              (if $I2 (result f32)
                (i32.ge_u
                  (local.get $l1)
                  (i32.const 964689920))
                (then
                  (call $f5
                    (f32.add
                      (local.get $l2)
                      (f32.div
                        (local.tee $l2
                          (f32.mul
                            (local.get $l2)
                            (local.get $l2)))
                        (f32.add
                          (f32.sqrt
                            (f32.add
                              (local.get $l2)
                              (f32.const 0x1p+0 (;=1;))))
                          (f32.const 0x1p+0 (;=1;)))))))
                (else
                  (local.get $l2)))))))
      (local.get $p0)))
  (func $f10 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 f32) (local $l4 i32) (local $l5 i32)
    (local.set $l1
      (local.get $p0))
    (if $I0
      (i32.ge_u
        (local.tee $l4
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647)))
        (i32.const 1283457024))
      (then
        (if $I1
          (f32.ne
            (local.get $p0)
            (local.get $p0))
          (then
            (return
              (local.get $p0))))
        (return
          (f32.copysign
            (f32.const 0x1.921fb4p+0 (;=1.5708;))
            (local.get $l1)))))
    (if $I2
      (i32.lt_u
        (local.get $l4)
        (i32.const 1054867456))
      (then
        (if $I3
          (i32.lt_u
            (local.get $l4)
            (i32.const 964689920))
          (then
            (return
              (local.get $p0))))
        (local.set $l5
          (i32.const -1)))
      (else
        (local.set $p0
          (f32.abs
            (local.get $p0)))
        (local.set $p0
          (if $I4 (result f32)
            (i32.lt_u
              (local.get $l4)
              (i32.const 1066926080))
            (then
              (if $I5 (result f32)
                (i32.lt_u
                  (local.get $l4)
                  (i32.const 1060110336))
                (then
                  (f32.div
                    (f32.sub
                      (f32.add
                        (local.get $p0)
                        (local.get $p0))
                      (f32.const 0x1p+0 (;=1;)))
                    (f32.add
                      (local.get $p0)
                      (f32.const 0x1p+1 (;=2;)))))
                (else
                  (local.set $l5
                    (i32.const 1))
                  (f32.div
                    (f32.sub
                      (local.get $p0)
                      (f32.const 0x1p+0 (;=1;)))
                    (f32.add
                      (local.get $p0)
                      (f32.const 0x1p+0 (;=1;)))))))
            (else
              (if $I6 (result f32)
                (i32.lt_u
                  (local.get $l4)
                  (i32.const 1075576832))
                (then
                  (local.set $l5
                    (i32.const 2))
                  (f32.div
                    (f32.sub
                      (local.get $p0)
                      (f32.const 0x1.8p+0 (;=1.5;)))
                    (f32.add
                      (f32.mul
                        (local.get $p0)
                        (f32.const 0x1.8p+0 (;=1.5;)))
                      (f32.const 0x1p+0 (;=1;)))))
                (else
                  (local.set $l5
                    (i32.const 3))
                  (f32.div
                    (f32.const -0x1p+0 (;=-1;))
                    (local.get $p0)))))))))
    (local.set $l2
      (f32.mul
        (local.tee $l3
          (f32.mul
            (local.get $p0)
            (local.get $p0)))
        (local.get $l3)))
    (local.set $l2
      (f32.mul
        (local.get $p0)
        (f32.add
          (f32.mul
            (local.get $l3)
            (f32.add
              (f32.mul
                (local.get $l2)
                (f32.add
                  (f32.mul
                    (local.get $l2)
                    (f32.const 0x1.f9584ap-5 (;=0.0616876;)))
                  (f32.const 0x1.23ea1ap-3 (;=0.142536;))))
              (f32.const 0x1.555552p-2 (;=0.333333;))))
          (f32.mul
            (local.get $l2)
            (f32.add
              (f32.mul
                (local.get $l2)
                (f32.const -0x1.b4248ep-4 (;=-0.10648;)))
              (f32.const -0x1.99953p-3 (;=-0.199992;)))))))
    (if $I7
      (i32.lt_s
        (local.get $l5)
        (i32.const 0))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $l2)))))
    (block $B8
      (block $B9
        (block $B10
          (block $B11
            (block $B12
              (block $B13
                (br_table $B13 $B12 $B11 $B10 $B9
                  (local.get $l5)))
              (local.set $p0
                (f32.sub
                  (f32.const 0x1.dac67p-2 (;=0.463648;))
                  (f32.sub
                    (f32.sub
                      (local.get $l2)
                      (f32.const 0x1.586ed2p-28 (;=5.01216e-09;)))
                    (local.get $p0))))
              (br $B8))
            (local.set $p0
              (f32.sub
                (f32.const 0x1.921fb4p-1 (;=0.785398;))
                (f32.sub
                  (f32.sub
                    (local.get $l2)
                    (f32.const 0x1.4442dp-25 (;=3.77489e-08;)))
                  (local.get $p0))))
            (br $B8))
          (local.set $p0
            (f32.sub
              (f32.const 0x1.f730bcp-1 (;=0.982794;))
              (f32.sub
                (f32.sub
                  (local.get $l2)
                  (f32.const 0x1.281f68p-25 (;=3.44732e-08;)))
                (local.get $p0))))
          (br $B8))
        (local.set $p0
          (f32.sub
            (f32.const 0x1.921fb4p+0 (;=1.5708;))
            (f32.sub
              (f32.sub
                (local.get $l2)
                (f32.const 0x1.4442dp-24 (;=7.54979e-08;)))
              (local.get $p0))))
        (br $B8))
      (unreachable))
    (f32.copysign
      (local.get $p0)
      (local.get $l1)))
  (func $atan (export "atan") (type $t0) (param $p0 f32) (result f32)
    (call $f10
      (local.get $p0)))
  (func $f12 (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    (if $I0
      (i32.or
        (f32.ne
          (local.get $p0)
          (local.get $p0))
        (f32.ne
          (local.get $p1)
          (local.get $p1)))
      (then
        (return
          (f32.add
            (local.get $p1)
            (local.get $p0)))))
    (if $I1
      (i32.eq
        (local.tee $l3
          (i32.reinterpret_f32
            (local.get $p1)))
        (i32.const 1065353216))
      (then
        (return
          (call $f10
            (local.get $p0)))))
    (local.set $l2
      (i32.or
        (i32.and
          (i32.shr_u
            (local.get $l3)
            (i32.const 30))
          (i32.const 2))
        (i32.shr_u
          (local.tee $l4
            (i32.reinterpret_f32
              (local.get $p0)))
          (i32.const 31))))
    (if $I2
      (i32.eqz
        (local.tee $l4
          (i32.and
            (local.get $l4)
            (i32.const 2147483647))))
      (then
        (block $B3
          (block $B4
            (block $B5
              (if $I6
                (i32.eqz
                  (i32.or
                    (i32.eqz
                      (local.get $l2))
                    (i32.eq
                      (local.get $l2)
                      (i32.const 1))))
                (then
                  (br_if $B5
                    (i32.eq
                      (local.get $l2)
                      (i32.const 2)))
                  (br_if $B4
                    (i32.eq
                      (local.get $l2)
                      (i32.const 3)))
                  (br $B3)))
              (return
                (local.get $p0)))
            (return
              (f32.const 0x1.921fb6p+1 (;=3.14159;))))
          (return
            (f32.const -0x1.921fb6p+1 (;=-3.14159;))))))
    (block $B7
      (br_if $B7
        (i32.eqz
          (local.tee $l3
            (i32.and
              (local.get $l3)
              (i32.const 2147483647)))))
      (if $I8
        (i32.eq
          (local.get $l3)
          (i32.const 2139095040))
        (then
          (return
            (select
              (f32.neg
                (local.tee $p0
                  (select
                    (select
                      (f32.const 0x1.2d97c8p+1 (;=2.35619;))
                      (f32.const 0x1.921fb6p-1 (;=0.785398;))
                      (local.tee $l3
                        (i32.and
                          (local.get $l2)
                          (i32.const 2))))
                    (select
                      (f32.const 0x1.921fb6p+1 (;=3.14159;))
                      (f32.const 0x0p+0 (;=0;))
                      (local.get $l3))
                    (i32.eq
                      (local.get $l4)
                      (i32.const 2139095040)))))
              (local.get $p0)
              (i32.and
                (local.get $l2)
                (i32.const 1))))))
      (br_if $B7
        (i32.or
          (i32.eq
            (local.get $l4)
            (i32.const 2139095040))
          (i32.lt_u
            (i32.add
              (local.get $l3)
              (i32.const 218103808))
            (local.get $l4))))
      (local.set $p0
        (if $I9 (result f32)
          (select
            (i32.lt_u
              (i32.add
                (local.get $l4)
                (i32.const 218103808))
              (local.get $l3))
            (i32.const 0)
            (i32.and
              (local.get $l2)
              (i32.const 2)))
          (then
            (f32.const 0x0p+0 (;=0;)))
          (else
            (call $f10
              (f32.abs
                (f32.div
                  (local.get $p0)
                  (local.get $p1)))))))
      (block $B10
        (block $B11
          (block $B12
            (block $B13
              (block $B14
                (br_table $B14 $B13 $B12 $B11 $B10
                  (local.get $l2)))
              (return
                (local.get $p0)))
            (return
              (f32.neg
                (local.get $p0))))
          (return
            (f32.sub
              (f32.const 0x1.921fb6p+1 (;=3.14159;))
              (f32.sub
                (local.get $p0)
                (f32.const -0x1.777a5cp-24 (;=-8.74228e-08;))))))
        (return
          (f32.sub
            (f32.sub
              (local.get $p0)
              (f32.const -0x1.777a5cp-24 (;=-8.74228e-08;)))
            (f32.const 0x1.921fb6p+1 (;=3.14159;)))))
      (unreachable))
    (select
      (f32.const -0x1.921fb6p+0 (;=-1.5708;))
      (f32.const 0x1.921fb6p+0 (;=1.5708;))
      (i32.and
        (local.get $l2)
        (i32.const 1))))
  (func $atan2 (export "atan2") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (call $f12
      (local.get $p0)
      (local.get $p1)))
  (func $atanh (export "atanh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 i32)
    (local.set $l1
      (f32.abs
        (local.get $p0)))
    (f32.copysign
      (if $I0 (result f32)
        (i32.lt_u
          (local.tee $l2
            (i32.reinterpret_f32
              (local.get $p0)))
          (i32.const 1056964608))
        (then
          (if $I1 (result f32)
            (i32.ge_u
              (local.get $l2)
              (i32.const 796917760))
            (then
              (f32.mul
                (call $f5
                  (f32.mul
                    (f32.add
                      (local.get $l1)
                      (local.get $l1))
                    (f32.add
                      (f32.div
                        (local.get $l1)
                        (f32.sub
                          (f32.const 0x1p+0 (;=1;))
                          (local.get $l1)))
                      (f32.const 0x1p+0 (;=1;)))))
                (f32.const 0x1p-1 (;=0.5;))))
            (else
              (local.get $l1))))
        (else
          (f32.mul
            (call $f5
              (f32.mul
                (f32.div
                  (local.get $l1)
                  (f32.sub
                    (f32.const 0x1p+0 (;=1;))
                    (local.get $l1)))
                (f32.const 0x1p+1 (;=2;))))
            (f32.const 0x1p-1 (;=0.5;)))))
      (local.get $p0)))
  (func $f15 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 f64) (local $l4 i32) (local $l5 i32)
    (if $I0
      (i32.ge_u
        (local.tee $l4
          (i32.and
            (local.tee $l5
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 2147483647)))
        (i32.const 2139095040))
      (then
        (return
          (f32.add
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l2
      (f64.mul
        (f64.mul
          (local.tee $l1
            (f64.promote_f32
              (f32.reinterpret_i32
                (i32.or
                  (if $I1 (result i32)
                    (i32.lt_u
                      (local.get $l4)
                      (i32.const 8388608))
                    (then
                      (if $I2
                        (i32.eqz
                          (local.get $l4))
                        (then
                          (return
                            (local.get $p0))))
                      (i32.add
                        (i32.div_u
                          (i32.and
                            (local.tee $l5
                              (i32.reinterpret_f32
                                (f32.mul
                                  (local.get $p0)
                                  (f32.const 0x1p+24 (;=1.67772e+07;)))))
                            (i32.const 2147483647))
                          (i32.const 3))
                        (i32.const 642849266)))
                    (else
                      (i32.add
                        (i32.div_u
                          (local.get $l4)
                          (i32.const 3))
                        (i32.const 709958130))))
                  (i32.and
                    (local.get $l5)
                    (i32.const -2147483648))))))
          (local.get $l1))
        (local.get $l1)))
    (local.set $l1
      (f64.mul
        (f64.mul
          (local.tee $l2
            (f64.div
              (f64.mul
                (local.get $l1)
                (f64.add
                  (local.tee $l3
                    (f64.add
                      (f64.promote_f32
                        (local.get $p0))
                      (f64.promote_f32
                        (local.get $p0))))
                  (local.get $l2)))
              (f64.add
                (f64.add
                  (f64.promote_f32
                    (local.get $p0))
                  (local.get $l2))
                (local.get $l2))))
          (local.get $l2))
        (local.get $l2)))
    (f32.demote_f64
      (f64.div
        (f64.mul
          (local.get $l2)
          (f64.add
            (local.get $l3)
            (local.get $l1)))
        (f64.add
          (f64.add
            (f64.promote_f32
              (local.get $p0))
            (local.get $l1))
          (local.get $l1)))))
  (func $cbrt (export "cbrt") (type $t0) (param $p0 f32) (result f32)
    (call $f15
      (local.get $p0)))
  (func $ceil (export "ceil") (type $t0) (param $p0 f32) (result f32)
    (f32.ceil
      (local.get $p0)))
  (func $f18 (type $t2) (param $p0 f64) (result i32)
    (i32.wrap_i64
      (i64.trunc_sat_f64_s
        (f64.sub
          (local.get $p0)
          (f64.mul
            (f64.floor
              (f64.mul
                (local.get $p0)
                (f64.const 0x1p-32 (;=2.32831e-10;))))
            (f64.const 0x1p+32 (;=4.29497e+09;)))))))
  (func $clz32 (export "clz32") (type $t0) (param $p0 f32) (result f32)
    (if $I0 (result f32)
      (f32.ne
        (f32.sub
          (local.get $p0)
          (local.get $p0))
        (f32.const 0x0p+0 (;=0;)))
      (then
        (f32.const 0x1p+5 (;=32;)))
      (else
        (f32.convert_i32_s
          (i32.clz
            (call $f18
              (f64.promote_f32
                (local.get $p0))))))))
  (func $f20 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64) (local $l7 i64) (local $l8 i64)
    (local.set $l4
      (i32.shr_u
        (local.tee $l3
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.le_u
        (local.tee $l3
          (i32.and
            (local.get $l3)
            (i32.const 2147483647)))
        (i32.const 1061752794))
      (then
        (if $I1
          (i32.lt_u
            (local.get $l3)
            (i32.const 964689920))
          (then
            (return
              (f32.const 0x1p+0 (;=1;)))))
        (local.set $l2
          (f64.mul
            (local.tee $l1
              (f64.mul
                (local.tee $l1
                  (f64.promote_f32
                    (local.get $p0)))
                (local.get $l1)))
            (local.get $l1)))
        (return
          (f32.demote_f64
            (f64.add
              (f64.add
                (f64.add
                  (f64.mul
                    (local.get $l1)
                    (f64.const -0x1.ffffffd0c5e81p-2 (;=-0.5;)))
                  (f64.const 0x1p+0 (;=1;)))
                (f64.mul
                  (local.get $l2)
                  (f64.const 0x1.55553e1053a42p-5 (;=0.0416666;))))
              (f64.mul
                (f64.mul
                  (local.get $l2)
                  (local.get $l1))
                (f64.add
                  (f64.mul
                    (local.get $l1)
                    (f64.const 0x1.99342e0ee5069p-16 (;=2.43904e-05;)))
                  (f64.const -0x1.6c087e80f1e27p-10 (;=-0.00138868;)))))))))
    (if $I2
      (i32.ge_u
        (local.get $l3)
        (i32.const 2139095040))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l3
      (block $B3 (result i32)
        (if $I4
          (i32.lt_u
            (local.get $l3)
            (i32.const 1305022427))
          (then
            (global.set $g7
              (f64.sub
                (f64.sub
                  (f64.promote_f32
                    (local.get $p0))
                  (f64.mul
                    (local.tee $l1
                      (f64.nearest
                        (f64.mul
                          (f64.promote_f32
                            (local.get $p0))
                          (f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)))))
                    (f64.const 0x1.921fb5p+0 (;=1.5708;))))
                (f64.mul
                  (local.get $l1)
                  (f64.const 0x1.110b4611a6263p-26 (;=1.58933e-08;)))))
            (br $B3
              (i32.trunc_sat_f64_s
                (local.get $l1)))))
        (local.set $l7
          (i64.extend_i32_s
            (i32.and
              (local.tee $l5
                (i32.sub
                  (i32.shr_s
                    (local.get $l3)
                    (i32.const 23))
                  (i32.const 152)))
              (i32.const 63))))
        (local.set $l6
          (i64.load offset=8
            (local.tee $l5
              (i32.add
                (i32.shl
                  (i32.shr_s
                    (local.get $l5)
                    (i32.const 6))
                  (i32.const 3))
                (i32.const 1024)))))
        (global.set $g7
          (f64.mul
            (f64.copysign
              (f64.const 0x1.921fb54442d18p-64 (;=8.5153e-20;))
              (f64.promote_f32
                (local.get $p0)))
            (f64.convert_i64_s
              (local.tee $l7
                (i64.shl
                  (local.tee $l6
                    (i64.add
                      (i64.mul
                        (local.tee $l8
                          (i64.extend_i32_s
                            (i32.or
                              (i32.and
                                (local.get $l3)
                                (i32.const 8388607))
                              (i32.const 8388608))))
                        (i64.or
                          (i64.shl
                            (i64.load
                              (local.get $l5))
                            (local.get $l7))
                          (i64.shr_u
                            (local.get $l6)
                            (i64.sub
                              (i64.const 64)
                              (local.get $l7)))))
                      (i64.shr_u
                        (i64.mul
                          (if $I5 (result i64)
                            (i64.gt_u
                              (local.get $l7)
                              (i64.const 32))
                            (then
                              (i64.or
                                (i64.shl
                                  (local.get $l6)
                                  (i64.sub
                                    (local.get $l7)
                                    (i64.const 32)))
                                (i64.shr_u
                                  (i64.load offset=16
                                    (local.get $l5))
                                  (i64.sub
                                    (i64.const 96)
                                    (local.get $l7)))))
                            (else
                              (i64.shr_u
                                (local.get $l6)
                                (i64.sub
                                  (i64.const 32)
                                  (local.get $l7)))))
                          (local.get $l8))
                        (i64.const 32))))
                  (i64.const 2))))))
        (select
          (i32.sub
            (i32.const 0)
            (local.tee $l3
              (i32.wrap_i64
                (i64.add
                  (i64.shr_u
                    (local.get $l6)
                    (i64.const 62))
                  (i64.shr_u
                    (local.get $l7)
                    (i64.const 63))))))
          (local.get $l3)
          (local.get $l4))))
    (local.set $l1
      (global.get $g7))
    (select
      (f32.neg
        (local.tee $p0
          (if $I6 (result f32)
            (i32.and
              (local.get $l3)
              (i32.const 1))
            (then
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (local.get $l1)
                    (f64.mul
                      (local.tee $l1
                        (f64.mul
                          (local.tee $l2
                            (f64.mul
                              (local.get $l1)
                              (local.get $l1)))
                          (local.get $l1)))
                      (f64.add
                        (f64.mul
                          (local.get $l2)
                          (f64.const 0x1.11110896efbb2p-7 (;=0.00833333;)))
                        (f64.const -0x1.5555554cbac77p-3 (;=-0.166667;)))))
                  (f64.mul
                    (f64.mul
                      (local.get $l1)
                      (f64.mul
                        (local.get $l2)
                        (local.get $l2)))
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.6cd878c3b46a7p-19 (;=2.71831e-06;)))
                      (f64.const -0x1.a00f9e2cae774p-13 (;=-0.000198393;)))))))
            (else
              (local.set $l2
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l1)
                      (local.get $l1)))
                  (local.get $l1)))
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const -0x1.ffffffd0c5e81p-2 (;=-0.5;)))
                      (f64.const 0x1p+0 (;=1;)))
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.55553e1053a42p-5 (;=0.0416666;))))
                  (f64.mul
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1))
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const 0x1.99342e0ee5069p-16 (;=2.43904e-05;)))
                      (f64.const -0x1.6c087e80f1e27p-10 (;=-0.00138868;))))))))))
      (local.get $p0)
      (i32.and
        (i32.add
          (local.get $l3)
          (i32.const 1))
        (i32.const 2))))
  (func $cos (export "cos") (type $t0) (param $p0 f32) (result f32)
    (call $f20
      (local.get $p0)))
  (func $f22 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32) (local $l7 f32)
    (local.set $l2
      (i32.and
        (local.tee $l3
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 2147483647)))
    (local.set $l3
      (i32.shr_u
        (local.get $l3)
        (i32.const 31)))
    (if $I0
      (i32.ge_u
        (local.get $l2)
        (i32.const 1100331076))
      (then
        (if $I1
          (i32.gt_u
            (local.get $l2)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0))))
        (if $I2
          (local.get $l3)
          (then
            (return
              (f32.const -0x1p+0 (;=-1;)))))
        (if $I3
          (i32.gt_u
            (local.get $l2)
            (i32.const 1118925335))
          (then
            (return
              (f32.mul
                (local.get $p0)
                (f32.const 0x1p+127 (;=1.70141e+38;))))))))
    (if $I4
      (i32.gt_u
        (local.get $l2)
        (i32.const 1051816472))
      (then
        (local.set $l4
          (f32.sub
            (f32.sub
              (local.tee $l4
                (f32.sub
                  (local.get $p0)
                  (f32.mul
                    (local.tee $p0
                      (f32.convert_i32_s
                        (local.tee $l1
                          (select
                            (i32.sub
                              (i32.const 1)
                              (i32.shl
                                (local.get $l3)
                                (i32.const 1)))
                            (i32.trunc_sat_f32_s
                              (f32.add
                                (f32.mul
                                  (local.get $p0)
                                  (f32.const 0x1.715476p+0 (;=1.4427;)))
                                (f32.copysign
                                  (f32.const 0x1p-1 (;=0.5;))
                                  (local.get $p0))))
                            (i32.lt_u
                              (local.get $l2)
                              (i32.const 1065686418))))))
                    (f32.const 0x1.62e3p-1 (;=0.693138;)))))
              (local.tee $p0
                (f32.sub
                  (local.get $l4)
                  (local.tee $l4
                    (f32.mul
                      (local.get $p0)
                      (f32.const 0x1.2fefa2p-17 (;=9.058e-06;)))))))
            (local.get $l4))))
      (else
        (if $I5
          (i32.lt_u
            (local.get $l2)
            (i32.const 855638016))
          (then
            (return
              (local.get $p0))))))
    (local.set $l6
      (f32.sub
        (f32.const 0x1.8p+1 (;=3;))
        (f32.mul
          (local.tee $l7
            (f32.add
              (f32.mul
                (local.tee $l5
                  (f32.mul
                    (local.get $p0)
                    (local.tee $l6
                      (f32.mul
                        (local.get $p0)
                        (f32.const 0x1p-1 (;=0.5;))))))
                (f32.add
                  (f32.mul
                    (local.get $l5)
                    (f32.const 0x1.9e602p-10 (;=0.00158072;)))
                  (f32.const -0x1.1110dp-5 (;=-0.0333332;))))
              (f32.const 0x1p+0 (;=1;))))
          (local.get $l6))))
    (local.set $l6
      (f32.mul
        (local.get $l5)
        (f32.div
          (f32.sub
            (local.get $l7)
            (local.get $l6))
          (f32.sub
            (f32.const 0x1.8p+2 (;=6;))
            (f32.mul
              (local.get $p0)
              (local.get $l6))))))
    (if $I6
      (i32.eqz
        (local.get $l1))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (f32.sub
              (f32.mul
                (local.get $p0)
                (local.get $l6))
              (local.get $l5))))))
    (local.set $l4
      (f32.sub
        (f32.sub
          (f32.mul
            (local.get $p0)
            (f32.sub
              (local.get $l6)
              (local.get $l4)))
          (local.get $l4))
        (local.get $l5)))
    (if $I7
      (i32.eq
        (local.get $l1)
        (i32.const -1))
      (then
        (return
          (f32.sub
            (f32.mul
              (f32.sub
                (local.get $p0)
                (local.get $l4))
              (f32.const 0x1p-1 (;=0.5;)))
            (f32.const 0x1p-1 (;=0.5;))))))
    (if $I8
      (i32.eq
        (local.get $l1)
        (i32.const 1))
      (then
        (if $I9
          (f32.lt
            (local.get $p0)
            (f32.const -0x1p-2 (;=-0.25;)))
          (then
            (return
              (f32.mul
                (f32.sub
                  (local.get $l4)
                  (f32.add
                    (local.get $p0)
                    (f32.const 0x1p-1 (;=0.5;))))
                (f32.const -0x1p+1 (;=-2;))))))
        (return
          (f32.add
            (f32.mul
              (f32.sub
                (local.get $p0)
                (local.get $l4))
              (f32.const 0x1p+1 (;=2;)))
            (f32.const 0x1p+0 (;=1;))))))
    (local.set $l5
      (f32.reinterpret_i32
        (i32.shl
          (i32.add
            (local.get $l1)
            (i32.const 127))
          (i32.const 23))))
    (if $I10
      (i32.or
        (i32.lt_s
          (local.get $l1)
          (i32.const 0))
        (i32.gt_s
          (local.get $l1)
          (i32.const 56)))
      (then
        (return
          (f32.sub
            (select
              (f32.mul
                (f32.add
                  (local.tee $p0
                    (f32.add
                      (f32.sub
                        (local.get $p0)
                        (local.get $l4))
                      (f32.const 0x1p+0 (;=1;))))
                  (local.get $p0))
                (f32.const 0x1p+127 (;=1.70141e+38;)))
              (f32.mul
                (local.get $p0)
                (local.get $l5))
              (i32.eq
                (local.get $l1)
                (i32.const 128)))
            (f32.const 0x1p+0 (;=1;))))))
    (f32.mul
      (f32.add
        (local.get $p0)
        (select
          (f32.sub
            (f32.sub
              (f32.const 0x1p+0 (;=1;))
              (local.tee $p0
                (f32.reinterpret_i32
                  (i32.shl
                    (i32.sub
                      (i32.const 127)
                      (local.get $l1))
                    (i32.const 23)))))
            (local.get $l4))
          (f32.sub
            (f32.const 0x1p+0 (;=1;))
            (f32.add
              (local.get $l4)
              (local.get $p0)))
          (i32.lt_s
            (local.get $l1)
            (i32.const 20))))
      (local.get $l5)))
  (func $f23 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    (local.set $l4
      (i32.shr_u
        (local.tee $l5
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.ge_u
        (local.tee $l5
          (i32.and
            (local.get $l5)
            (i32.const 2147483647)))
        (i32.const 1118743632))
      (then
        (if $I1
          (i32.gt_u
            (local.get $l5)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0))))
        (if $I2
          (i32.ge_u
            (local.get $l5)
            (i32.const 1118925336))
          (then
            (if $I3
              (local.get $l4)
              (then
                (if $I4
                  (i32.ge_u
                    (local.get $l5)
                    (i32.const 1120924085))
                  (then
                    (return
                      (f32.const 0x0p+0 (;=0;))))))
              (else
                (return
                  (f32.mul
                    (local.get $p0)
                    (f32.const 0x1p+127 (;=1.70141e+38;))))))))))
    (if $I5
      (i32.gt_u
        (local.get $l5)
        (i32.const 1051816472))
      (then
        (local.set $p0
          (f32.sub
            (local.tee $l1
              (f32.sub
                (local.get $p0)
                (f32.mul
                  (f32.convert_i32_s
                    (local.tee $l3
                      (select
                        (i32.trunc_sat_f32_s
                          (f32.add
                            (f32.mul
                              (local.get $p0)
                              (f32.const 0x1.715476p+0 (;=1.4427;)))
                            (f32.copysign
                              (f32.const 0x1p-1 (;=0.5;))
                              (local.get $p0))))
                        (i32.sub
                          (i32.const 1)
                          (i32.shl
                            (local.get $l4)
                            (i32.const 1)))
                        (i32.gt_u
                          (local.get $l5)
                          (i32.const 1065686418)))))
                  (f32.const 0x1.62e4p-1 (;=0.693146;)))))
            (local.tee $l2
              (f32.mul
                (f32.convert_i32_s
                  (local.get $l3))
                (f32.const 0x1.7f7d1cp-20 (;=1.42861e-06;)))))))
      (else
        (local.set $l1
          (if $I6 (result f32)
            (i32.gt_u
              (local.get $l5)
              (i32.const 956301312))
            (then
              (local.get $p0))
            (else
              (return
                (f32.add
                  (local.get $p0)
                  (f32.const 0x1p+0 (;=1;)))))))))
    (local.set $p0
      (f32.add
        (f32.add
          (f32.sub
            (f32.div
              (f32.mul
                (local.get $p0)
                (local.tee $p0
                  (f32.sub
                    (local.get $p0)
                    (f32.mul
                      (local.tee $p0
                        (f32.mul
                          (local.get $p0)
                          (local.get $p0)))
                      (f32.add
                        (f32.mul
                          (local.get $p0)
                          (f32.const -0x1.6aa42ap-9 (;=-0.00276673;)))
                        (f32.const 0x1.55551ep-3 (;=0.166666;)))))))
              (f32.sub
                (f32.const 0x1p+1 (;=2;))
                (local.get $p0)))
            (local.get $l2))
          (local.get $l1))
        (f32.const 0x1p+0 (;=1;))))
    (if $I7 (result f32)
      (local.get $l3)
      (then
        (f32.mul
          (if $I8 (result f32)
            (i32.gt_s
              (local.get $l3)
              (i32.const 127))
            (then
              (local.set $p0
                (f32.mul
                  (local.get $p0)
                  (f32.const 0x1p+127 (;=1.70141e+38;))))
              (if $I9 (result f32)
                (i32.gt_s
                  (local.tee $l3
                    (i32.sub
                      (local.get $l3)
                      (i32.const 127)))
                  (i32.const 127))
                (then
                  (local.set $l3
                    (select
                      (local.tee $l3
                        (i32.sub
                          (local.get $l3)
                          (i32.const 127)))
                      (i32.const 127)
                      (i32.lt_s
                        (local.get $l3)
                        (i32.const 127))))
                  (f32.mul
                    (local.get $p0)
                    (f32.const 0x1p+127 (;=1.70141e+38;))))
                (else
                  (local.get $p0))))
            (else
              (if $I10 (result f32)
                (i32.lt_s
                  (local.get $l3)
                  (i32.const -126))
                (then
                  (local.set $p0
                    (f32.mul
                      (local.get $p0)
                      (f32.const 0x1p-102 (;=1.97215e-31;))))
                  (if $I11 (result f32)
                    (i32.lt_s
                      (local.tee $l3
                        (i32.add
                          (local.get $l3)
                          (i32.const 102)))
                      (i32.const -126))
                    (then
                      (local.set $l3
                        (select
                          (local.tee $l3
                            (i32.add
                              (local.get $l3)
                              (i32.const 102)))
                          (i32.const -126)
                          (i32.gt_s
                            (local.get $l3)
                            (i32.const -126))))
                      (f32.mul
                        (local.get $p0)
                        (f32.const 0x1p-102 (;=1.97215e-31;))))
                    (else
                      (local.get $p0))))
                (else
                  (local.get $p0)))))
          (f32.reinterpret_i32
            (i32.shl
              (i32.add
                (local.get $l3)
                (i32.const 127))
              (i32.const 23)))))
      (else
        (local.get $p0))))
  (func $cosh (export "cosh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32)
    (block $B0 (result f32)
      (local.set $p0
        (f32.reinterpret_i32
          (local.tee $l1
            (i32.and
              (i32.reinterpret_f32
                (local.get $p0))
              (i32.const 2147483647)))))
      (if $I1
        (i32.lt_u
          (local.get $l1)
          (i32.const 1060205079))
        (then
          (drop
            (br_if $B0
              (f32.const 0x1p+0 (;=1;))
              (i32.lt_u
                (local.get $l1)
                (i32.const 964689920))))
          (br $B0
            (f32.add
              (f32.div
                (f32.mul
                  (local.tee $p0
                    (call $f22
                      (local.get $p0)))
                  (local.get $p0))
                (f32.add
                  (f32.add
                    (local.get $p0)
                    (local.get $p0))
                  (f32.const 0x1p+1 (;=2;))))
              (f32.const 0x1p+0 (;=1;))))))
      (if $I2
        (i32.lt_u
          (local.get $l1)
          (i32.const 1118925335))
        (then
          (br $B0
            (f32.add
              (f32.mul
                (local.tee $p0
                  (call $f23
                    (local.get $p0)))
                (f32.const 0x1p-1 (;=0.5;)))
              (f32.div
                (f32.const 0x1p-1 (;=0.5;))
                (local.get $p0))))))
      (f32.mul
        (f32.mul
          (call $f23
            (f32.sub
              (local.get $p0)
              (f32.const 0x1.45c778p+7 (;=162.89;))))
          (f32.const 0x1p+117 (;=1.66153e+35;)))
        (f32.const 0x1p+117 (;=1.66153e+35;)))))
  (func $exp (export "exp") (type $t0) (param $p0 f32) (result f32)
    (call $f23
      (local.get $p0)))
  (func $expm1 (export "expm1") (type $t0) (param $p0 f32) (result f32)
    (call $f22
      (local.get $p0)))
  (func $floor (export "floor") (type $t0) (param $p0 f32) (result f32)
    (f32.floor
      (local.get $p0)))
  (func $fround (export "fround") (type $t0) (param $p0 f32) (result f32)
    (local.get $p0))
  (func $f29 (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 f32)
    (if $I0
      (i32.gt_u
        (local.tee $l3
          (i32.and
            (i32.reinterpret_f32
              (local.get $p1))
            (i32.const 2147483647)))
        (local.tee $l2
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647))))
      (then
        (local.set $l4
          (local.get $l2))
        (local.set $l2
          (local.get $l3))
        (local.set $l3
          (local.get $l4))))
    (local.set $p1
      (f32.reinterpret_i32
        (local.get $l3)))
    (if $I1
      (i32.eq
        (local.get $l3)
        (i32.const 2139095040))
      (then
        (return
          (local.get $p1))))
    (local.set $l5
      (f32.reinterpret_i32
        (local.get $l2)))
    (if $I2
      (i32.or
        (i32.or
          (i32.eqz
            (local.get $l3))
          (i32.ge_u
            (local.get $l2)
            (i32.const 2139095040)))
        (i32.ge_u
          (i32.sub
            (local.get $l2)
            (local.get $l3))
          (i32.const 209715200)))
      (then
        (return
          (f32.add
            (local.get $l5)
            (local.get $p1)))))
    (local.set $p0
      (f32.const 0x1p+0 (;=1;)))
    (local.set $l5
      (if $I3 (result f32)
        (i32.ge_u
          (local.get $l2)
          (i32.const 1568669696))
        (then
          (local.set $p0
            (f32.const 0x1p+90 (;=1.23794e+27;)))
          (local.set $p1
            (f32.mul
              (local.get $p1)
              (f32.const 0x1p-90 (;=8.07794e-28;))))
          (f32.mul
            (local.get $l5)
            (f32.const 0x1p-90 (;=8.07794e-28;))))
        (else
          (if $I4 (result f32)
            (i32.lt_u
              (local.get $l3)
              (i32.const 562036736))
            (then
              (local.set $p0
                (f32.const 0x1p-90 (;=8.07794e-28;)))
              (local.set $p1
                (f32.mul
                  (local.get $p1)
                  (f32.const 0x1p+90 (;=1.23794e+27;))))
              (f32.mul
                (local.get $l5)
                (f32.const 0x1p+90 (;=1.23794e+27;))))
            (else
              (local.get $l5))))))
    (f32.mul
      (local.get $p0)
      (f32.sqrt
        (f32.demote_f64
          (f64.add
            (f64.mul
              (f64.promote_f32
                (local.get $l5))
              (f64.promote_f32
                (local.get $l5)))
            (f64.mul
              (f64.promote_f32
                (local.get $p1))
              (f64.promote_f32
                (local.get $p1))))))))
  (func $hypot (export "hypot") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (call $f29
      (local.get $p0)
      (local.get $p1)))
  (func $imul (export "imul") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 f32)
    (if $I0 (result f32)
      (f32.ne
        (f32.sub
          (local.tee $l2
            (f32.add
              (local.get $p0)
              (local.get $p1)))
          (local.get $l2))
        (f32.const 0x0p+0 (;=0;)))
      (then
        (f32.const 0x0p+0 (;=0;)))
      (else
        (f32.convert_i32_s
          (i32.mul
            (call $f18
              (f64.promote_f32
                (local.get $p0)))
            (call $f18
              (f64.promote_f32
                (local.get $p1))))))))
  (func $log (export "log") (type $t0) (param $p0 f32) (result f32)
    (call $f6
      (local.get $p0)))
  (func $f33 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32) (local $l7 f32) (local $l8 f32)
    (if $I0
      (i32.or
        (local.tee $l2
          (i32.shr_u
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (i32.lt_u
          (local.get $l1)
          (i32.const 8388608)))
      (then
        (if $I1
          (i32.eqz
            (i32.shl
              (local.get $l1)
              (i32.const 1)))
          (then
            (return
              (f32.div
                (f32.const -0x1p+0 (;=-1;))
                (f32.mul
                  (local.get $p0)
                  (local.get $p0))))))
        (if $I2
          (local.get $l2)
          (then
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (local.set $l3
          (i32.const -25))
        (local.set $l1
          (i32.reinterpret_f32
            (f32.mul
              (local.get $p0)
              (f32.const 0x1p+25 (;=3.35544e+07;))))))
      (else
        (if $I3
          (i32.ge_u
            (local.get $l1)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0)))
          (else
            (if $I4
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))
              (then
                (return
                  (f32.const 0x0p+0 (;=0;)))))))))
    (local.set $l7
      (f32.mul
        (local.tee $l4
          (f32.mul
            (local.tee $p0
              (f32.div
                (local.tee $l6
                  (f32.sub
                    (f32.reinterpret_i32
                      (i32.add
                        (i32.and
                          (local.tee $l1
                            (i32.add
                              (local.get $l1)
                              (i32.const 4913933)))
                          (i32.const 8388607))
                        (i32.const 1060439283)))
                    (f32.const 0x1p+0 (;=1;))))
                (f32.add
                  (local.get $l6)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $p0)))
        (local.get $l4)))
    (f32.add
      (f32.add
        (f32.add
          (f32.add
            (f32.mul
              (local.tee $l5
                (f32.convert_i32_s
                  (i32.add
                    (local.get $l3)
                    (i32.sub
                      (i32.shr_u
                        (local.get $l1)
                        (i32.const 23))
                      (i32.const 127)))))
              (f32.const 0x1.a84fb6p-21 (;=7.90342e-07;)))
            (f32.mul
              (f32.add
                (local.tee $p0
                  (f32.add
                    (f32.sub
                      (f32.sub
                        (local.get $l6)
                        (local.tee $l8
                          (f32.reinterpret_i32
                            (i32.and
                              (i32.reinterpret_f32
                                (f32.sub
                                  (local.get $l6)
                                  (local.tee $l6
                                    (f32.mul
                                      (f32.mul
                                        (local.get $l6)
                                        (f32.const 0x1p-1 (;=0.5;)))
                                      (local.get $l6)))))
                              (i32.const -4096)))))
                      (local.get $l6))
                    (f32.mul
                      (local.get $p0)
                      (f32.add
                        (local.get $l6)
                        (f32.add
                          (f32.mul
                            (local.get $l4)
                            (f32.add
                              (f32.mul
                                (local.get $l7)
                                (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                              (f32.const 0x1.555554p-1 (;=0.666667;))))
                          (f32.mul
                            (local.get $l7)
                            (f32.add
                              (f32.mul
                                (local.get $l7)
                                (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                              (f32.const 0x1.999c26p-2 (;=0.40001;)))))))))
                (local.get $l8))
              (f32.const -0x1.09d5b2p-15 (;=-3.169e-05;))))
          (f32.mul
            (local.get $p0)
            (f32.const 0x1.bccp-2 (;=0.434326;))))
        (f32.mul
          (local.get $l8)
          (f32.const 0x1.bccp-2 (;=0.434326;))))
      (f32.mul
        (local.get $l5)
        (f32.const 0x1.3441p-2 (;=0.301029;)))))
  (func $log10 (export "log10") (type $t0) (param $p0 f32) (result f32)
    (call $f33
      (local.get $p0)))
  (func $log1p (export "log1p") (type $t0) (param $p0 f32) (result f32)
    (call $f5
      (local.get $p0)))
  (func $f36 (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 f32) (local $l5 f32) (local $l6 f32) (local $l7 f32)
    (if $I0
      (i32.or
        (local.tee $l2
          (i32.shr_u
            (local.tee $l1
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (i32.lt_u
          (local.get $l1)
          (i32.const 8388608)))
      (then
        (if $I1
          (i32.eqz
            (i32.shl
              (local.get $l1)
              (i32.const 1)))
          (then
            (return
              (f32.div
                (f32.const -0x1p+0 (;=-1;))
                (f32.mul
                  (local.get $p0)
                  (local.get $p0))))))
        (if $I2
          (local.get $l2)
          (then
            (return
              (f32.div
                (f32.sub
                  (local.get $p0)
                  (local.get $p0))
                (f32.const 0x0p+0 (;=0;))))))
        (local.set $l3
          (i32.const -25))
        (local.set $l1
          (i32.reinterpret_f32
            (f32.mul
              (local.get $p0)
              (f32.const 0x1p+25 (;=3.35544e+07;))))))
      (else
        (if $I3
          (i32.ge_u
            (local.get $l1)
            (i32.const 2139095040))
          (then
            (return
              (local.get $p0)))
          (else
            (if $I4
              (i32.eq
                (local.get $l1)
                (i32.const 1065353216))
              (then
                (return
                  (f32.const 0x0p+0 (;=0;)))))))))
    (local.set $l6
      (f32.mul
        (local.tee $l4
          (f32.mul
            (local.tee $p0
              (f32.div
                (local.tee $l5
                  (f32.sub
                    (f32.reinterpret_i32
                      (i32.add
                        (i32.and
                          (local.tee $l1
                            (i32.add
                              (local.get $l1)
                              (i32.const 4913933)))
                          (i32.const 8388607))
                        (i32.const 1060439283)))
                    (f32.const 0x1p+0 (;=1;))))
                (f32.add
                  (local.get $l5)
                  (f32.const 0x1p+1 (;=2;)))))
            (local.get $p0)))
        (local.get $l4)))
    (f32.add
      (f32.add
        (f32.add
          (f32.mul
            (f32.add
              (local.tee $p0
                (f32.add
                  (f32.sub
                    (f32.sub
                      (local.get $l5)
                      (local.tee $l7
                        (f32.reinterpret_i32
                          (i32.and
                            (i32.reinterpret_f32
                              (f32.sub
                                (local.get $l5)
                                (local.tee $l5
                                  (f32.mul
                                    (f32.mul
                                      (local.get $l5)
                                      (f32.const 0x1p-1 (;=0.5;)))
                                    (local.get $l5)))))
                            (i32.const -4096)))))
                    (local.get $l5))
                  (f32.mul
                    (local.get $p0)
                    (f32.add
                      (local.get $l5)
                      (f32.add
                        (f32.mul
                          (local.get $l4)
                          (f32.add
                            (f32.mul
                              (local.get $l6)
                              (f32.const 0x1.23d3dcp-2 (;=0.284988;)))
                            (f32.const 0x1.555554p-1 (;=0.666667;))))
                        (f32.mul
                          (local.get $l6)
                          (f32.add
                            (f32.mul
                              (local.get $l6)
                              (f32.const 0x1.f13c4cp-3 (;=0.242791;)))
                            (f32.const 0x1.999c26p-2 (;=0.40001;)))))))))
              (local.get $l7))
            (f32.const -0x1.7135a8p-13 (;=-0.000176053;)))
          (f32.mul
            (local.get $p0)
            (f32.const 0x1.716p+0 (;=1.44287;))))
        (f32.mul
          (local.get $l7)
          (f32.const 0x1.716p+0 (;=1.44287;))))
      (f32.convert_i32_s
        (i32.add
          (local.get $l3)
          (i32.sub
            (i32.shr_u
              (local.get $l1)
              (i32.const 23))
            (i32.const 127))))))
  (func $log2 (export "log2") (type $t0) (param $p0 f32) (result f32)
    (call $f36
      (local.get $p0)))
  (func $max (export "max") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (f32.max
      (local.get $p0)
      (local.get $p1)))
  (func $min (export "min") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (f32.min
      (local.get $p0)
      (local.get $p1)))
  (func $f40 (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (local $l2 f64) (local $l3 f64) (local $l4 f64) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i64) (local $l10 i64) (local $l11 f32)
    (if $I0
      (f32.le
        (f32.abs
          (local.get $p1))
        (f32.const 0x1p+1 (;=2;)))
      (then
        (if $I1
          (f32.eq
            (local.get $p1)
            (f32.const 0x1p+1 (;=2;)))
          (then
            (return
              (f32.mul
                (local.get $p0)
                (local.get $p0)))))
        (if $I2
          (f32.eq
            (local.get $p1)
            (f32.const 0x1p-1 (;=0.5;)))
          (then
            (return
              (select
                (f32.abs
                  (f32.sqrt
                    (local.get $p0)))
                (f32.const inf (;=inf;))
                (f32.ne
                  (local.get $p0)
                  (f32.const -inf (;=-inf;)))))))
        (if $I3
          (f32.eq
            (local.get $p1)
            (f32.const -0x1p+0 (;=-1;)))
          (then
            (return
              (f32.div
                (f32.const 0x1p+0 (;=1;))
                (local.get $p0)))))
        (if $I4
          (f32.eq
            (local.get $p1)
            (f32.const 0x1p+0 (;=1;)))
          (then
            (return
              (local.get $p0))))
        (if $I5
          (f32.eq
            (local.get $p1)
            (f32.const 0x0p+0 (;=0;)))
          (then
            (return
              (f32.const 0x1p+0 (;=1;)))))))
    (if $I6
      (f32.eq
        (local.get $p1)
        (f32.const 0x0p+0 (;=0;)))
      (then
        (return
          (f32.const 0x1p+0 (;=1;)))))
    (if $I7
      (i32.or
        (f32.ne
          (local.get $p0)
          (local.get $p0))
        (f32.ne
          (local.get $p1)
          (local.get $p1)))
      (then
        (return
          (f32.const nan (;=nan;)))))
    (if $I8
      (i32.and
        (local.tee $l5
          (i32.shr_u
            (local.tee $l8
              (i32.reinterpret_f32
                (local.get $p0)))
            (i32.const 31)))
        (f32.eq
          (f32.nearest
            (local.get $p1))
          (local.get $p1)))
      (then
        (local.set $l5
          (i32.const 0))
        (local.set $l7
          (i32.shl
            (f32.ne
              (local.tee $l11
                (f32.mul
                  (local.get $p1)
                  (f32.const 0x1p-1 (;=0.5;))))
              (f32.nearest
                (local.get $l11)))
            (i32.const 31)))
        (local.set $p0
          (f32.neg
            (local.get $p0)))))
    (local.set $l6
      (i32.reinterpret_f32
        (local.get $p1)))
    (f32.reinterpret_i32
      (i32.or
        (if $I9 (result i32)
          (i32.eq
            (local.tee $l8
              (i32.and
                (local.get $l8)
                (i32.const 2147483647)))
            (i32.const 1065353216))
          (then
            (select
              (i32.const 2143289344)
              (i32.const 1065353216)
              (i32.or
                (local.get $l5)
                (i32.eq
                  (i32.and
                    (local.get $l6)
                    (i32.const 2147483647))
                  (i32.const 2139095040)))))
          (else
            (if $I10 (result i32)
              (local.get $l8)
              (then
                (if $I11 (result i32)
                  (i32.eq
                    (local.get $l8)
                    (i32.const 2139095040))
                  (then
                    (select
                      (i32.const 0)
                      (i32.const 2139095040)
                      (i32.lt_s
                        (local.get $l6)
                        (i32.const 0))))
                  (else
                    (if $I12 (result i32)
                      (local.get $l5)
                      (then
                        (i32.const 2143289344))
                      (else
                        (i32.reinterpret_f32
                          (f32.demote_f64
                            (block $B13 (result f64)
                              (local.set $l9
                                (i64.shr_s
                                  (i64.sub
                                    (local.tee $l10
                                      (i64.reinterpret_f64
                                        (f64.promote_f32
                                          (local.get $p0))))
                                    (i64.const 4604544271217802189))
                                  (i64.const 52)))
                              (local.set $l3
                                (f64.mul
                                  (local.tee $l2
                                    (f64.div
                                      (f64.sub
                                        (local.tee $l2
                                          (f64.reinterpret_i64
                                            (i64.sub
                                              (local.get $l10)
                                              (i64.shl
                                                (local.get $l9)
                                                (i64.const 52)))))
                                        (f64.const 0x1p+0 (;=1;)))
                                      (f64.add
                                        (local.get $l2)
                                        (f64.const 0x1p+0 (;=1;)))))
                                  (local.get $l2)))
                              (drop
                                (br_if $B13
                                  (f64.const 0x0p+0 (;=0;))
                                  (f64.lt
                                    (local.tee $l2
                                      (f64.mul
                                        (f64.promote_f32
                                          (local.get $p1))
                                        (f64.add
                                          (f64.mul
                                            (f64.add
                                              (local.get $l2)
                                              (f64.mul
                                                (f64.mul
                                                  (local.get $l2)
                                                  (local.get $l3))
                                                (f64.add
                                                  (f64.add
                                                    (f64.mul
                                                      (local.get $l3)
                                                      (f64.const 0x1.999a7a8af4132p-3 (;=0.200002;)))
                                                    (f64.const 0x1.555554fd9caefp-2 (;=0.333333;)))
                                                  (f64.mul
                                                    (f64.add
                                                      (f64.mul
                                                        (local.get $l3)
                                                        (f64.const 0x1.e2f663b001c97p-4 (;=0.117911;)))
                                                      (f64.const 0x1.2438d7943703p-3 (;=0.142687;)))
                                                    (f64.mul
                                                      (local.get $l3)
                                                      (local.get $l3))))))
                                            (f64.const 0x1.71547652b82fep+1 (;=2.88539;)))
                                          (f64.convert_i64_s
                                            (local.get $l9)))))
                                    (f64.const -0x1.ffp+9 (;=-1022;)))))
                              (drop
                                (br_if $B13
                                  (f64.const inf (;=inf;))
                                  (f64.ge
                                    (local.get $l2)
                                    (f64.const 0x1p+10 (;=1024;)))))
                              (local.set $l2
                                (f64.mul
                                  (local.tee $l4
                                    (f64.sub
                                      (local.get $l2)
                                      (local.tee $l3
                                        (f64.nearest
                                          (local.get $l2)))))
                                  (local.get $l4)))
                              (f64.reinterpret_i64
                                (i64.add
                                  (i64.reinterpret_f64
                                    (f64.add
                                      (f64.mul
                                        (local.get $l4)
                                        (f64.add
                                          (f64.add
                                            (f64.add
                                              (f64.mul
                                                (local.get $l4)
                                                (f64.const 0x1.ebfbe07d97b91p-3 (;=0.240227;)))
                                              (f64.const 0x1.62e4302fcc24ap-1 (;=0.693147;)))
                                            (f64.mul
                                              (f64.add
                                                (f64.mul
                                                  (local.get $l4)
                                                  (f64.const 0x1.3b29e3ce9aef6p-7 (;=0.00961803;)))
                                                (f64.const 0x1.c6af6ccfc1a65p-5 (;=0.0555036;)))
                                              (local.get $l2)))
                                          (f64.mul
                                            (f64.add
                                              (f64.mul
                                                (local.get $l4)
                                                (f64.const 0x1.446c81e384864p-13 (;=0.000154697;)))
                                              (f64.const 0x1.5f0896145a89fp-10 (;=0.00133909;)))
                                            (f64.mul
                                              (local.get $l2)
                                              (local.get $l2)))))
                                      (f64.const 0x1p+0 (;=1;))))
                                  (i64.shl
                                    (i64.trunc_sat_f64_s
                                      (local.get $l3))
                                    (i64.const 52))))))))))))
              (else
                (select
                  (i32.const 2139095040)
                  (i32.const 0)
                  (i32.lt_s
                    (local.get $l6)
                    (i32.const 0)))))))
        (local.get $l7))))
  (func $pow (export "pow") (type $t1) (param $p0 f32) (param $p1 f32) (result f32)
    (call $f40
      (local.get $p0)
      (local.get $p1)))
  (func $f42 (type $t4) (param $p0 i64) (result i64)
    (i64.xor
      (i64.shr_u
        (local.tee $p0
          (i64.mul
            (i64.xor
              (i64.shr_u
                (local.tee $p0
                  (i64.mul
                    (i64.xor
                      (local.get $p0)
                      (i64.shr_u
                        (local.get $p0)
                        (i64.const 33)))
                    (i64.const -49064778989728563)))
                (i64.const 33))
              (local.get $p0))
            (i64.const -4265267296055464877)))
        (i64.const 33))
      (local.get $p0)))
  (func $f43 (type $t5) (param $p0 i32) (result i32)
    (i32.xor
      (i32.shr_u
        (local.tee $p0
          (i32.xor
            (i32.add
              (i32.mul
                (i32.or
                  (local.tee $p0
                    (i32.mul
                      (i32.or
                        (local.tee $p0
                          (i32.add
                            (local.get $p0)
                            (i32.const 1831565813)))
                        (i32.const 1))
                      (i32.xor
                        (local.get $p0)
                        (i32.shr_u
                          (local.get $p0)
                          (i32.const 15)))))
                  (i32.const 61))
                (i32.xor
                  (local.get $p0)
                  (i32.shr_u
                    (local.get $p0)
                    (i32.const 7))))
              (local.get $p0))
            (local.get $p0)))
        (i32.const 14))
      (local.get $p0)))
  (func $random (export "random") (type $t6) (result f32)
    (local $l0 i64) (local $l1 i32) (local $l2 i32)
    (if $I0
      (i32.eqz
        (global.get $g8))
      (then
        (if $I1
          (i64.eqz
            (local.tee $l0
              (i64.reinterpret_f64
                (call $env.seed))))
          (then
            (local.set $l0
              (i64.const -7046029254386353131))))
        (global.set $g9
          (call $f42
            (local.get $l0)))
        (drop
          (call $f42
            (i64.xor
              (global.get $g9)
              (i64.const -1))))
        (global.set $g10
          (call $f43
            (i32.wrap_i64
              (local.get $l0))))
        (global.set $g11
          (call $f43
            (global.get $g10)))
        (global.set $g8
          (i32.const 1))))
    (global.set $g10
      (i32.xor
        (i32.xor
          (local.tee $l1
            (i32.xor
              (local.tee $l2
                (global.get $g10))
              (global.get $g11)))
          (i32.rotl
            (local.get $l2)
            (i32.const 26)))
        (i32.shl
          (local.get $l1)
          (i32.const 9))))
    (global.set $g11
      (i32.rotl
        (local.get $l1)
        (i32.const 13)))
    (f32.sub
      (f32.reinterpret_i32
        (i32.or
          (i32.shr_u
            (i32.mul
              (i32.rotl
                (i32.mul
                  (local.get $l2)
                  (i32.const -1640531525))
                (i32.const 5))
              (i32.const 5))
            (i32.const 9))
          (i32.const 1065353216)))
      (f32.const 0x1p+0 (;=1;))))
  (func $round (export "round") (type $t0) (param $p0 f32) (result f32)
    (f32.sub
      (f32.ceil
        (local.get $p0))
      (f32.convert_i32_u
        (f32.gt
          (f32.sub
            (f32.ceil
              (local.get $p0))
            (f32.const 0x1p-1 (;=0.5;)))
          (local.get $p0)))))
  (func $sign (export "sign") (type $t0) (param $p0 f32) (result f32)
    (select
      (f32.copysign
        (f32.const 0x1p+0 (;=1;))
        (local.get $p0))
      (local.get $p0)
      (f32.gt
        (f32.abs
          (local.get $p0))
        (f32.const 0x0p+0 (;=0;)))))
  (func $signbit (export "signbit") (type $t7) (param $p0 f32) (result i32)
    (i32.shr_u
      (i32.reinterpret_f32
        (local.get $p0))
      (i32.const 31)))
  (func $f48 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 f64) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i64) (local $l8 i64) (local $l9 i64)
    (local.set $l5
      (i32.shr_u
        (local.tee $l4
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.le_u
        (local.tee $l4
          (i32.and
            (local.get $l4)
            (i32.const 2147483647)))
        (i32.const 1061752794))
      (then
        (if $I1
          (i32.lt_u
            (local.get $l4)
            (i32.const 964689920))
          (then
            (return
              (local.get $p0))))
        (local.set $l1
          (f64.mul
            (local.tee $l3
              (f64.mul
                (local.tee $l2
                  (f64.promote_f32
                    (local.get $p0)))
                (local.get $l2)))
            (local.get $l2)))
        (return
          (f32.demote_f64
            (f64.add
              (f64.add
                (local.get $l2)
                (f64.mul
                  (local.get $l1)
                  (f64.add
                    (f64.mul
                      (local.get $l3)
                      (f64.const 0x1.11110896efbb2p-7 (;=0.00833333;)))
                    (f64.const -0x1.5555554cbac77p-3 (;=-0.166667;)))))
              (f64.mul
                (f64.mul
                  (local.get $l1)
                  (f64.mul
                    (local.get $l3)
                    (local.get $l3)))
                (f64.add
                  (f64.mul
                    (local.get $l3)
                    (f64.const 0x1.6cd878c3b46a7p-19 (;=2.71831e-06;)))
                  (f64.const -0x1.a00f9e2cae774p-13 (;=-0.000198393;)))))))))
    (if $I2
      (i32.ge_u
        (local.get $l4)
        (i32.const 2139095040))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l4
      (block $B3 (result i32)
        (if $I4
          (i32.lt_u
            (local.get $l4)
            (i32.const 1305022427))
          (then
            (global.set $g7
              (f64.sub
                (f64.sub
                  (f64.promote_f32
                    (local.get $p0))
                  (f64.mul
                    (local.tee $l1
                      (f64.nearest
                        (f64.mul
                          (f64.promote_f32
                            (local.get $p0))
                          (f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)))))
                    (f64.const 0x1.921fb5p+0 (;=1.5708;))))
                (f64.mul
                  (local.get $l1)
                  (f64.const 0x1.110b4611a6263p-26 (;=1.58933e-08;)))))
            (br $B3
              (i32.trunc_sat_f64_s
                (local.get $l1)))))
        (local.set $l8
          (i64.extend_i32_s
            (i32.and
              (local.tee $l6
                (i32.sub
                  (i32.shr_s
                    (local.get $l4)
                    (i32.const 23))
                  (i32.const 152)))
              (i32.const 63))))
        (local.set $l7
          (i64.load offset=8
            (local.tee $l6
              (i32.add
                (i32.shl
                  (i32.shr_s
                    (local.get $l6)
                    (i32.const 6))
                  (i32.const 3))
                (i32.const 1024)))))
        (global.set $g7
          (f64.mul
            (f64.copysign
              (f64.const 0x1.921fb54442d18p-64 (;=8.5153e-20;))
              (f64.promote_f32
                (local.get $p0)))
            (f64.convert_i64_s
              (local.tee $l8
                (i64.shl
                  (local.tee $l7
                    (i64.add
                      (i64.mul
                        (local.tee $l9
                          (i64.extend_i32_s
                            (i32.or
                              (i32.and
                                (local.get $l4)
                                (i32.const 8388607))
                              (i32.const 8388608))))
                        (i64.or
                          (i64.shl
                            (i64.load
                              (local.get $l6))
                            (local.get $l8))
                          (i64.shr_u
                            (local.get $l7)
                            (i64.sub
                              (i64.const 64)
                              (local.get $l8)))))
                      (i64.shr_u
                        (i64.mul
                          (if $I5 (result i64)
                            (i64.gt_u
                              (local.get $l8)
                              (i64.const 32))
                            (then
                              (i64.or
                                (i64.shl
                                  (local.get $l7)
                                  (i64.sub
                                    (local.get $l8)
                                    (i64.const 32)))
                                (i64.shr_u
                                  (i64.load offset=16
                                    (local.get $l6))
                                  (i64.sub
                                    (i64.const 96)
                                    (local.get $l8)))))
                            (else
                              (i64.shr_u
                                (local.get $l7)
                                (i64.sub
                                  (i64.const 32)
                                  (local.get $l8)))))
                          (local.get $l9))
                        (i64.const 32))))
                  (i64.const 2))))))
        (select
          (i32.sub
            (i32.const 0)
            (local.tee $l4
              (i32.wrap_i64
                (i64.add
                  (i64.shr_u
                    (local.get $l7)
                    (i64.const 62))
                  (i64.shr_u
                    (local.get $l8)
                    (i64.const 63))))))
          (local.get $l4)
          (local.get $l5))))
    (local.set $l1
      (global.get $g7))
    (select
      (f32.neg
        (local.tee $p0
          (if $I6 (result f32)
            (i32.and
              (local.get $l4)
              (i32.const 1))
            (then
              (local.set $l2
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l1)
                      (local.get $l1)))
                  (local.get $l1)))
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const -0x1.ffffffd0c5e81p-2 (;=-0.5;)))
                      (f64.const 0x1p+0 (;=1;)))
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.55553e1053a42p-5 (;=0.0416666;))))
                  (f64.mul
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1))
                    (f64.add
                      (f64.mul
                        (local.get $l1)
                        (f64.const 0x1.99342e0ee5069p-16 (;=2.43904e-05;)))
                      (f64.const -0x1.6c087e80f1e27p-10 (;=-0.00138868;)))))))
            (else
              (f32.demote_f64
                (f64.add
                  (f64.add
                    (local.get $l1)
                    (f64.mul
                      (local.tee $l1
                        (f64.mul
                          (local.tee $l2
                            (f64.mul
                              (local.get $l1)
                              (local.get $l1)))
                          (local.get $l1)))
                      (f64.add
                        (f64.mul
                          (local.get $l2)
                          (f64.const 0x1.11110896efbb2p-7 (;=0.00833333;)))
                        (f64.const -0x1.5555554cbac77p-3 (;=-0.166667;)))))
                  (f64.mul
                    (f64.mul
                      (local.get $l1)
                      (f64.mul
                        (local.get $l2)
                        (local.get $l2)))
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.6cd878c3b46a7p-19 (;=2.71831e-06;)))
                      (f64.const -0x1.a00f9e2cae774p-13 (;=-0.000198393;))))))))))
      (local.get $p0)
      (i32.and
        (local.get $l4)
        (i32.const 2))))
  (func $sin (export "sin") (type $t0) (param $p0 f32) (result f32)
    (call $f48
      (local.get $p0)))
  (func $sinh (export "sinh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 f32) (local $l2 f32) (local $l3 i32)
    (block $B0 (result f32)
      (local.set $l2
        (f32.reinterpret_i32
          (local.tee $l3
            (i32.and
              (i32.reinterpret_f32
                (local.get $p0))
              (i32.const 2147483647)))))
      (local.set $l1
        (f32.copysign
          (f32.const 0x1p-1 (;=0.5;))
          (local.get $p0)))
      (if $I1
        (i32.lt_u
          (local.get $l3)
          (i32.const 1118925335))
        (then
          (local.set $l2
            (call $f22
              (local.get $l2)))
          (if $I2
            (i32.lt_u
              (local.get $l3)
              (i32.const 1065353216))
            (then
              (drop
                (br_if $B0
                  (local.get $p0)
                  (i32.lt_u
                    (local.get $l3)
                    (i32.const 964689920))))
              (br $B0
                (f32.mul
                  (local.get $l1)
                  (f32.sub
                    (f32.add
                      (local.get $l2)
                      (local.get $l2))
                    (f32.div
                      (f32.mul
                        (local.get $l2)
                        (local.get $l2))
                      (f32.add
                        (local.get $l2)
                        (f32.const 0x1p+0 (;=1;)))))))))
          (br $B0
            (f32.mul
              (local.get $l1)
              (f32.add
                (local.get $l2)
                (f32.div
                  (local.get $l2)
                  (f32.add
                    (local.get $l2)
                    (f32.const 0x1p+0 (;=1;)))))))))
      (f32.mul
        (f32.mul
          (call $f23
            (f32.sub
              (local.get $l2)
              (f32.const 0x1.45c778p+7 (;=162.89;))))
          (f32.mul
            (f32.add
              (local.get $l1)
              (local.get $l1))
            (f32.const 0x1p+117 (;=1.66153e+35;))))
        (f32.const 0x1p+117 (;=1.66153e+35;)))))
  (func $sqrt (export "sqrt") (type $t0) (param $p0 f32) (result f32)
    (f32.sqrt
      (local.get $p0)))
  (func $f52 (type $t0) (param $p0 f32) (result f32)
    (local $l1 f64) (local $l2 f64) (local $l3 f64) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i64) (local $l8 i64) (local $l9 i64)
    (local.set $l5
      (i32.shr_u
        (local.tee $l4
          (i32.reinterpret_f32
            (local.get $p0)))
        (i32.const 31)))
    (if $I0
      (i32.le_u
        (local.tee $l4
          (i32.and
            (local.get $l4)
            (i32.const 2147483647)))
        (i32.const 1061752794))
      (then
        (if $I1
          (i32.lt_u
            (local.get $l4)
            (i32.const 964689920))
          (then
            (return
              (local.get $p0))))
        (local.set $l3
          (f64.mul
            (local.tee $l2
              (f64.mul
                (local.tee $l1
                  (f64.promote_f32
                    (local.get $p0)))
                (local.get $l1)))
            (local.get $l2)))
        (return
          (f32.demote_f64
            (f64.add
              (f64.add
                (local.get $l1)
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1)))
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.112fd38999f72p-3 (;=0.133392;)))
                    (f64.const 0x1.5554d3418c99fp-2 (;=0.333331;)))))
              (f64.mul
                (f64.mul
                  (local.get $l1)
                  (local.get $l3))
                (f64.add
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.91df3908c33cep-6 (;=0.0245283;)))
                    (f64.const 0x1.b54c91d865afep-5 (;=0.0533812;)))
                  (f64.mul
                    (local.get $l3)
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.362b9bf971bcdp-7 (;=0.00946565;)))
                      (f64.const 0x1.85dadfcecf44ep-9 (;=0.00297436;)))))))))))
    (if $I2
      (i32.ge_u
        (local.get $l4)
        (i32.const 2139095040))
      (then
        (return
          (f32.sub
            (local.get $p0)
            (local.get $p0)))))
    (local.set $l4
      (block $B3 (result i32)
        (if $I4
          (i32.lt_u
            (local.get $l4)
            (i32.const 1305022427))
          (then
            (global.set $g7
              (f64.sub
                (f64.sub
                  (f64.promote_f32
                    (local.get $p0))
                  (f64.mul
                    (local.tee $l1
                      (f64.nearest
                        (f64.mul
                          (f64.promote_f32
                            (local.get $p0))
                          (f64.const 0x1.45f306dc9c883p-1 (;=0.63662;)))))
                    (f64.const 0x1.921fb5p+0 (;=1.5708;))))
                (f64.mul
                  (local.get $l1)
                  (f64.const 0x1.110b4611a6263p-26 (;=1.58933e-08;)))))
            (br $B3
              (i32.trunc_sat_f64_s
                (local.get $l1)))))
        (local.set $l8
          (i64.extend_i32_s
            (i32.and
              (local.tee $l6
                (i32.sub
                  (i32.shr_s
                    (local.get $l4)
                    (i32.const 23))
                  (i32.const 152)))
              (i32.const 63))))
        (local.set $l7
          (i64.load offset=8
            (local.tee $l6
              (i32.add
                (i32.shl
                  (i32.shr_s
                    (local.get $l6)
                    (i32.const 6))
                  (i32.const 3))
                (i32.const 1024)))))
        (global.set $g7
          (f64.mul
            (f64.copysign
              (f64.const 0x1.921fb54442d18p-64 (;=8.5153e-20;))
              (f64.promote_f32
                (local.get $p0)))
            (f64.convert_i64_s
              (local.tee $l8
                (i64.shl
                  (local.tee $l7
                    (i64.add
                      (i64.mul
                        (local.tee $l9
                          (i64.extend_i32_s
                            (i32.or
                              (i32.and
                                (local.get $l4)
                                (i32.const 8388607))
                              (i32.const 8388608))))
                        (i64.or
                          (i64.shl
                            (i64.load
                              (local.get $l6))
                            (local.get $l8))
                          (i64.shr_u
                            (local.get $l7)
                            (i64.sub
                              (i64.const 64)
                              (local.get $l8)))))
                      (i64.shr_u
                        (i64.mul
                          (if $I5 (result i64)
                            (i64.gt_u
                              (local.get $l8)
                              (i64.const 32))
                            (then
                              (i64.or
                                (i64.shl
                                  (local.get $l7)
                                  (i64.sub
                                    (local.get $l8)
                                    (i64.const 32)))
                                (i64.shr_u
                                  (i64.load offset=16
                                    (local.get $l6))
                                  (i64.sub
                                    (i64.const 96)
                                    (local.get $l8)))))
                            (else
                              (i64.shr_u
                                (local.get $l7)
                                (i64.sub
                                  (i64.const 32)
                                  (local.get $l8)))))
                          (local.get $l9))
                        (i64.const 32))))
                  (i64.const 2))))))
        (select
          (i32.sub
            (i32.const 0)
            (local.tee $l4
              (i32.wrap_i64
                (i64.add
                  (i64.shr_u
                    (local.get $l7)
                    (i64.const 62))
                  (i64.shr_u
                    (local.get $l8)
                    (i64.const 63))))))
          (local.get $l4)
          (local.get $l5))))
    (local.set $l3
      (f64.mul
        (local.tee $l2
          (f64.mul
            (local.tee $l1
              (global.get $g7))
            (local.get $l1)))
        (local.get $l2)))
    (f32.demote_f64
      (select
        (f64.div
          (f64.const -0x1p+0 (;=-1;))
          (local.tee $l1
            (f64.add
              (f64.add
                (local.get $l1)
                (f64.mul
                  (local.tee $l1
                    (f64.mul
                      (local.get $l2)
                      (local.get $l1)))
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.112fd38999f72p-3 (;=0.133392;)))
                    (f64.const 0x1.5554d3418c99fp-2 (;=0.333331;)))))
              (f64.mul
                (f64.mul
                  (local.get $l1)
                  (local.get $l3))
                (f64.add
                  (f64.add
                    (f64.mul
                      (local.get $l2)
                      (f64.const 0x1.91df3908c33cep-6 (;=0.0245283;)))
                    (f64.const 0x1.b54c91d865afep-5 (;=0.0533812;)))
                  (f64.mul
                    (local.get $l3)
                    (f64.add
                      (f64.mul
                        (local.get $l2)
                        (f64.const 0x1.362b9bf971bcdp-7 (;=0.00946565;)))
                      (f64.const 0x1.85dadfcecf44ep-9 (;=0.00297436;)))))))))
        (local.get $l1)
        (i32.and
          (local.get $l4)
          (i32.const 1)))))
  (func $tan (export "tan") (type $t0) (param $p0 f32) (result f32)
    (call $f52
      (local.get $p0)))
  (func $tanh (export "tanh") (type $t0) (param $p0 f32) (result f32)
    (local $l1 i32) (local $l2 f32)
    (local.set $l2
      (f32.reinterpret_i32
        (local.tee $l1
          (i32.and
            (i32.reinterpret_f32
              (local.get $p0))
            (i32.const 2147483647)))))
    (f32.copysign
      (if $I0 (result f32)
        (i32.gt_u
          (local.get $l1)
          (i32.const 1057791828))
        (then
          (if $I1 (result f32)
            (i32.gt_u
              (local.get $l1)
              (i32.const 1092616192))
            (then
              (f32.add
                (f32.div
                  (f32.const 0x0p+0 (;=0;))
                  (local.get $l2))
                (f32.const 0x1p+0 (;=1;))))
            (else
              (f32.sub
                (f32.const 0x1p+0 (;=1;))
                (f32.div
                  (f32.const 0x1p+1 (;=2;))
                  (f32.add
                    (call $f22
                      (f32.add
                        (local.get $l2)
                        (local.get $l2)))
                    (f32.const 0x1p+1 (;=2;))))))))
        (else
          (if $I2 (result f32)
            (i32.gt_u
              (local.get $l1)
              (i32.const 1048757624))
            (then
              (f32.div
                (local.tee $l2
                  (call $f22
                    (f32.add
                      (local.get $l2)
                      (local.get $l2))))
                (f32.add
                  (local.get $l2)
                  (f32.const 0x1p+1 (;=2;)))))
            (else
              (if $I3 (result f32)
                (i32.ge_u
                  (local.get $l1)
                  (i32.const 8388608))
                (then
                  (f32.div
                    (f32.neg
                      (local.tee $l2
                        (call $f22
                          (f32.mul
                            (local.get $l2)
                            (f32.const -0x1p+1 (;=-2;))))))
                    (f32.add
                      (local.get $l2)
                      (f32.const 0x1p+1 (;=2;)))))
                (else
                  (local.get $l2)))))))
      (local.get $p0)))
  (func $trunc (export "trunc") (type $t0) (param $p0 f32) (result f32)
    (f32.trunc
      (local.get $p0)))
  (memory $memory (export "memory") 1)
  (global $E (export "E") f32 (f32.const 0x1.5bf0a8p+1 (;=2.71828;)))
  (global $LN2 (export "LN2") f32 (f32.const 0x1.62e43p-1 (;=0.693147;)))
  (global $LOG2E (export "LOG2E") f32 (f32.const 0x1.715476p+0 (;=1.4427;)))
  (global $LOG10E (export "LOG10E") f32 (f32.const 0x1.bcb7b2p-2 (;=0.434294;)))
  (global $PI (export "PI") f32 (f32.const 0x1.921fb6p+1 (;=3.14159;)))
  (global $SQRT1_2 (export "SQRT1_2") f32 (f32.const 0x1.6a09e6p-1 (;=0.707107;)))
  (global $SQRT2 (export "SQRT2") f32 (f32.const 0x1.6a09e6p+0 (;=1.41421;)))
  (global $g7 (mut f64) (f64.const 0x0p+0 (;=0;)))
  (global $g8 (mut i32) (i32.const 0))
  (global $g9 (mut i64) (i64.const 0))
  (global $g10 (mut i32) (i32.const 0))
  (global $g11 (mut i32) (i32.const 0))
  (data $d0 (i32.const 1024) ")\15DNn\83\f9\a2\c0\dd4\f5\d1W'\fcA\90C<\99\95b\dba\c5\bb\de\abcQ\fe"))
