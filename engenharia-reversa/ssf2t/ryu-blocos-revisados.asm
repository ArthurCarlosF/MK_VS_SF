
; input_dispatch — decoded instructions; CPU byte addresses
0007F862 422e016d           clr.b     $16d(a6)
0007F866 61000050           bsr.w     $7f8b8
0007F86A 6100033c           bsr.w     $7fba8
0007F86E 610001da           bsr.w     $7fa4a
0007F872 6100065e           bsr.w     $7fed2
0007F876 600004f6           bra.w     $7fd6e

; special_action_dispatch — decoded instructions; CPU byte addresses
0007F87A 4a2e0169           tst.b     $169(a6)
0007F87E 672a               beq.b     $7f8aa
0007F880 0c2e0008016a       cmpi.b    #$8, $16a(a6)
0007F886 6608               bne.b     $7f890
0007F888 4eb8452a           jsr       $452a.w
0007F88C 661c               bne.b     $7f8aa
0007F88E 6006               bra.b     $7f896
0007F890 4eb84542           jsr       $4542.w
0007F894 6614               bne.b     $7f8aa
0007F896 1d6e016a0088       move.b    $16a(a6), $88(a6)
0007F89C 7000               moveq     #$0, d0
0007F89E 102e0088           move.b    $88(a6), d0
0007F8A2 323b000a           move.w    $7f8ae(pc, d0.w), d1
0007F8A6 4efb1006           jmp       $7f8ae(pc, d1.w)
0007F8AA 7000               moveq     #$0, d0
0007F8AC 4e75               rts       

; hadouken_dispatch — decoded instructions; CPU byte addresses
0007FD6E 7000               moveq     #$0, d0
0007FD70 102e0094           move.b    $94(a6), d0
0007FD74 323b0006           move.w    $7fd7c(pc, d0.w), d1
0007FD78 4efb1002           jmp       $7fd7c(pc, d1.w)

; state_0 — decoded instructions; CPU byte addresses
0007FD84 302e03a6           move.w    $3a6(a6), d0
0007FD88 0240000f           andi.w    #$f, d0
0007FD8C 0c400004           cmpi.w    #$4, d0
0007FD90 6608               bne.b     $7fd9a
0007FD92 542e0094           addq.b    #$2, $94(a6)
0007FD96 600000da           bra.w     $7fe72
0007FD9A 422e0094           clr.b     $94(a6)
0007FD9E 4e75               rts       

; state_2 — decoded instructions; CPU byte addresses
0007FDA0 532e0095           subq.b    #$1, $95(a6)
0007FDA4 67f4               beq.b     $7fd9a
0007FDA6 302e03a6           move.w    $3a6(a6), d0
0007FDAA 0240000f           andi.w    #$f, d0
0007FDAE 0c400006           cmpi.w    #$6, d0
0007FDB2 6608               bne.b     $7fdbc
0007FDB4 542e0094           addq.b    #$2, $94(a6)
0007FDB8 600000b8           bra.w     $7fe72
0007FDBC 4e75               rts       

; state_4 — decoded instructions; CPU byte addresses
0007FDBE 532e0095           subq.b    #$1, $95(a6)
0007FDC2 67d6               beq.b     $7fd9a
0007FDC4 302e03a6           move.w    $3a6(a6), d0
0007FDC8 0240000f           andi.w    #$f, d0
0007FDCC 0c400002           cmpi.w    #$2, d0
0007FDD0 661e               bne.b     $7fdf0
0007FDD2 542e0094           addq.b    #$2, $94(a6)
0007FDD6 1d7c000c0095       move.b    #$c, $95(a6)
0007FDDC 323c0070           move.w    #$70, d1
0007FDE0 4eb844d0           jsr       $44d0.w
0007FDE4 6626               bne.b     $7fe0c
0007FDE6 323c0070           move.w    #$70, d1
0007FDEA 4eb844de           jsr       $44de.w
0007FDEE 661c               bne.b     $7fe0c
0007FDF0 4e75               rts       

; state_6 — decoded instructions; CPU byte addresses
0007FDF2 532e0095           subq.b    #$1, $95(a6)
0007FDF6 67a2               beq.b     $7fd9a
0007FDF8 323c0070           move.w    #$70, d1
0007FDFC 4eb844d0           jsr       $44d0.w
0007FE00 660a               bne.b     $7fe0c
0007FE02 323c0070           move.w    #$70, d1
0007FE06 4eb844de           jsr       $44de.w
0007FE0A 674e               beq.b     $7fe5a

; acceptance_checks — decoded instructions; CPU byte addresses
0007FE0C 7200               moveq     #$0, d1
0007FE0E 08000004           btst.b    #$4, d0
0007FE12 660a               bne.b     $7fe1e
0007FE14 7202               moveq     #$2, d1
0007FE16 08000005           btst.b    #$5, d0
0007FE1A 6602               bne.b     $7fe1e
0007FE1C 7204               moveq     #$4, d1
0007FE1E 303b104c           move.w    $7fe6c(pc, d1.w), d0
0007FE22 b02e0095           cmp.b     $95(a6), d0
0007FE26 6232               bhi.b     $7fe5a
0007FE28 4a6e01d4           tst.w     $1d4(a6)
0007FE2C 662c               bne.b     $7fe5a
0007FE2E 1d410096           move.b    d1, $96(a6)
0007FE32 4a2e016d           tst.b     $16d(a6)
0007FE36 660a               bne.b     $7fe42
0007FE38 1d7c0000016a       move.b    #$0, $16a(a6)
0007FE3E 1d41016b           move.b    d1, $16b(a6)
0007FE42 4eb84542           jsr       $4542.w
0007FE46 6714               beq.b     $7fe5c
0007FE48 4a2e016d           tst.b     $16d(a6)
0007FE4C 660c               bne.b     $7fe5a
0007FE4E 4a2e0169           tst.b     $169(a6)
0007FE52 6706               beq.b     $7fe5a
0007FE54 1d7c0001016d       move.b    #$1, $16d(a6)
0007FE5A 4e75               rts       
0007FE5C 1d7c00000088       move.b    #$0, $88(a6)
0007FE62 1d6e00960097       move.b    $96(a6), $97(a6)
0007FE68 6000003e           bra.w     $7fea8

; timer_reset — decoded instructions; CPU byte addresses
0007FE72 4eb82e96           jsr       $2e96.w
0007FE76 0240001f           andi.w    #$1f, d0
0007FE7A 1d7b00060095       move.b    $7fe82(pc, d0.w), $95(a6)
0007FE80 4e75               rts       

; commit_hadouken — decoded instructions; CPU byte addresses
0007FEA8 1d7c000c0003       move.b    #$c, $3(a6)
0007FEAE 422e0094           clr.b     $94(a6)
0007FEB2 422e0004           clr.b     $4(a6)
0007FEB6 422e0005           clr.b     $5(a6)
0007FEBA 1d7c0001018b       move.b    #$1, $18b(a6)
0007FEC0 526d0de2           addq.w    #$1, $de2(a5)
0007FEC4 4eb85b60           jsr       $5b60.w
0007FEC8 7002               moveq     #$2, d0
0007FECA 4eb84052           jsr       $4052.w
0007FECE 7001               moveq     #$1, d0
0007FED0 4e75               rts       

; animation_dispatch — decoded instructions; CPU byte addresses
00005246 287c00100000       movea.l   #$100000, a4
0000524C 600e               bra.b     $525c
0000524E 287c00100088       movea.l   #$100088, a4
00005254 6006               bra.b     $525c
00005256 287c00100110       movea.l   #$100110, a4
0000525C 1c2e0391           move.b    $391(a6), d6
00005260 4a2e03bd           tst.b     $3bd(a6)
00005264 670c               beq.b     $5272
00005266 7c10               moveq     #$10, d6
00005268 4a2e038e           tst.b     $38e(a6)
0000526C 6614               bne.b     $5282
0000526E 7c21               moveq     #$21, d6
00005270 6010               bra.b     $5282
00005272 4a2e038e           tst.b     $38e(a6)
00005276 670a               beq.b     $5282
00005278 4a2e03b6           tst.b     $3b6(a6)
0000527C 6704               beq.b     $5282
0000527E 06060011           addi.b    #$11, d6
00005282 4886               ext.w     d6
00005284 e54e               lsl.w     #$2, d6
00005286 28746000           movea.l   (a4, d6.w), a4
0000528A 4ed4               jmp       (a4)

; ryu_animation_select — decoded instructions; CPU byte addresses
0010FF12 102e0011           move.b    $11(a6), d0
0010FF16 142e0012           move.b    $12(a6), d2
0010FF1A b500               eor.b     d2, d0
0010FF1C 323b1028           move.w    $10ff46(pc, d1.w), d1
0010FF20 41fb1024           lea.l     $10ff46(pc, d1.w), a0
0010FF24 4880               ext.w     d0
0010FF26 d000               add.b     d0, d0
0010FF28 30300000           move.w    (a0, d0.w), d0
0010FF2C 41f00000           lea.l     (a0, d0.w), a0
0010FF30 2d48001a           move.l    a0, $1a(a6)
0010FF34 3d6800000018       move.w    $0(a0), $18(a6)
0010FF3A 3d6800020014       move.w    $2(a0), $14(a6)
0010FF40 4e75               rts       
