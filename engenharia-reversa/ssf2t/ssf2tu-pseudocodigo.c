/* AUTOMATIC GHIDRA RECONSTRUCTION. NOT ORIGINAL SOURCE; NOT A BUILDABLE PROJECT. */
/* CPS2 has separate opcode/data views. Main ROM here is the decrypted opcode view. */
/* Original data is preserved in DATA_BUS_ROM overlay. Data references require review. */

/* 00000290 FUN_00000290 */

undefined2 FUN_00000290(void)

{
  int unaff_A5;
  
  return *(undefined2 *)(*(int *)(unaff_A5 + -0x7e00) + 4);
}



/* 000002c6 FUN_000002c6 */

void FUN_000002c6(void)

{
  short sVar1;
  undefined *puVar2;
  undefined4 *puVar3;
  undefined4 *puVar4;
  undefined4 *puVar5;
  undefined4 *puVar6;
  int unaff_A5;
  
  puVar2 = &DAT_000056a2 + unaff_A5;
  sVar1 = 5;
  puVar3 = (undefined4 *)(unaff_A5 + 0x56f2);
  do {
    *puVar3 = puVar2;
    puVar2 = puVar2 + 8;
    sVar1 = sVar1 + -1;
    puVar3 = puVar3 + 1;
  } while (sVar1 != -1);
  puVar3 = (undefined4 *)(&DAT_000056a2 + unaff_A5);
  puVar5 = &DAT_00000c02;
  *(undefined4 *)((int)&PTR_DAT_0000571a + unaff_A5) = DAT_00000c02;
  sVar1 = 5;
  do {
    puVar6 = puVar5 + 1;
    puVar4 = puVar3 + 1;
    *puVar3 = *puVar5;
    puVar5 = puVar5 + 2;
    puVar3 = puVar3 + 2;
    *puVar4 = *puVar6;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000002fe vector_2fe */

/* WARNING: This function may have set the stack pointer */

void vector_2fe(void)

{
  FUN_00000884();
  return;
}



/* 00000332 reset_entry */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void reset_entry(void)

{
  undefined2 *puVar1;
  undefined2 *puVar2;
  
  _DAT_00400000 = 0x7080;
  _DAT_008040a0 = 0;
  puVar1 = (undefined2 *)&DAT_00900000;
  do {
    puVar2 = puVar1 + 1;
    *puVar1 = 0;
    puVar1 = puVar2;
  } while (puVar2 < &DAT_00904000);
  FUN_00000900();
  return;
}



/* 00000874 FUN_00000874 */

void FUN_00000874(void)

{
  undefined2 in_D0w;
  undefined2 in_D1w;
  undefined2 *in_A0;
  undefined2 *puVar1;
  undefined2 *in_A1;
  code *UNRECOVERED_JUMPTABLE;
  
  do {
    puVar1 = in_A0 + 1;
    *in_A0 = in_D0w;
    in_A0 = in_A0 + 2;
    *puVar1 = in_D1w;
  } while (in_A0 <= in_A1);
                    /* WARNING: Could not recover jumptable at 0x00000882. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*UNRECOVERED_JUMPTABLE)();
  return;
}



/* 00000884 FUN_00000884 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00000884(void)

{
  short sVar1;
  undefined2 *puVar2;
  undefined4 *puVar3;
  
  puVar2 = (undefined2 *)&DAT_00708000;
  sVar1 = 0x389;
  do {
    *puVar2 = 0;
    puVar3 = (undefined4 *)(puVar2 + 2);
    puVar2[1] = 0;
    puVar2 = puVar2 + 4;
    *puVar3 = 0;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  puVar2 = (undefined2 *)&DAT_00708000;
  sVar1 = 0x389;
  do {
    *puVar2 = 0;
    puVar3 = (undefined4 *)(puVar2 + 2);
    puVar2[1] = 0;
    puVar2 = puVar2 + 4;
    *puVar3 = 0;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  _DAT_007095f2 = 0x8000;
  _DAT_008040e0 = 0;
  FUN_00000874();
  return;
}



/* 00000900 FUN_00000900 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00000900(void)

{
  code *UNRECOVERED_JUMPTABLE;
  
  _DAT_00900400 = DAT_00000cf6 | 0xf000f000;
  _DAT_00900404 = DAT_00000cfa | 0xf000f000;
  _DAT_00900408 = DAT_00000cfe | 0xf000f000;
  _DAT_0090040c = DAT_00000d02 | 0xf000f000;
  _DAT_00900410 = DAT_00000d06 | 0xf000f000;
  _DAT_00900414 = DAT_00000d0a | 0xf000f000;
  _DAT_00900418 = DAT_00000d0e | 0xf000f000;
  _DAT_0090041c = DAT_00000d12 | 0xf000f000;
                    /* WARNING: Could not recover jumptable at 0x00000960. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*UNRECOVERED_JUMPTABLE)();
  return;
}



/* 00000962 FUN_00000962 */

void FUN_00000962(void)

{
  __m68k_trap(0);
  return;
}



/* 00000966 vector_966 */

void vector_966(void)

{
  short in_D0w;
  undefined2 in_D1w;
  undefined2 unaff_D2w;
  undefined4 in_A0;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + -0x8000 + (int)in_D0w) == '\0') {
    *(undefined2 *)(unaff_A5 + -0x8000 + (int)in_D0w) = 0xc00;
    *(undefined4 *)(unaff_A5 + -0x7ffc + (int)in_D0w) = in_A0;
    *(undefined2 *)(unaff_A5 + -0x7ff0 + (int)in_D0w) = in_D1w;
    *(undefined2 *)(unaff_A5 + -0x7fee + (int)in_D0w) = unaff_D2w;
  }
  return;
}



/* 00000984 FUN_00000984 */

void FUN_00000984(void)

{
  undefined1 *puVar1;
  int unaff_A5;
  
  __m68k_trap(1);
  puVar1 = *(undefined1 **)(unaff_A5 + -0x7dfc);
  *(undefined4 *)(puVar1 + 0x10) = 0;
  *(undefined4 *)(puVar1 + 0x14) = 0;
  *(undefined4 *)(puVar1 + 0x18) = 0;
  *(undefined4 *)(puVar1 + 0x1c) = 0;
  *puVar1 = 0;
  FUN_00000290();
  return;
}



/* 00000986 vector_986 */

void vector_986(void)

{
  undefined1 *puVar1;
  int unaff_A5;
  
  puVar1 = *(undefined1 **)(unaff_A5 + -0x7dfc);
  *(undefined4 *)(puVar1 + 0x10) = 0;
  *(undefined4 *)(puVar1 + 0x14) = 0;
  *(undefined4 *)(puVar1 + 0x18) = 0;
  *(undefined4 *)(puVar1 + 0x1c) = 0;
  *puVar1 = 0;
  FUN_00000290();
  return;
}



/* 000009a8 FUN_000009a8 */

void FUN_000009a8(void)

{
  __m68k_trap(2);
  return;
}



/* 000009ac vector_9ac */

void vector_9ac(void)

{
  short in_D0w;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + -0x8000 + (int)in_D0w) != '\0') {
    *(undefined4 *)(unaff_A5 + -0x7ff0 + (int)in_D0w) = 0;
    *(undefined4 *)(unaff_A5 + -0x7fec + (int)in_D0w) = 0;
    *(undefined4 *)(unaff_A5 + -0x7fe8 + (int)in_D0w) = 0;
    *(undefined4 *)(&DAT_ffff801c + in_D0w + unaff_A5) = 0;
    *(undefined1 *)(unaff_A5 + -0x8000 + (int)in_D0w) = 0;
  }
  return;
}



/* 000009d0 FUN_000009d0 */

undefined8 FUN_000009d0(void)

{
  undefined4 in_D0;
  undefined4 in_D1;
  
  __m68k_trap(3);
  return CONCAT44(in_D0,in_D1);
}



/* 000009dc vector_9dc */

void vector_9dc(void)

{
  ushort *puVar1;
  ushort in_D0w;
  ushort uVar2;
  int unaff_A5;
  undefined4 in_USP;
  ushort in_stack_00000000;
  undefined4 in_stack_00000002;
  
  puVar1 = *(ushort **)(unaff_A5 + -0x7dfc);
  uVar2 = 0x100;
  if ((char)in_D0w == '\0') {
    uVar2 = 0x200;
  }
  *puVar1 = uVar2 | in_D0w;
  *(undefined4 *)(puVar1 + 4) = in_USP;
  puVar1[1] = in_stack_00000000;
  *(undefined4 *)(puVar1 + 2) = in_stack_00000002;
  FUN_00000290();
  return;
}



/* 00000a08 vector_a08 */

void vector_a08(void)

{
  undefined1 *puVar1;
  int unaff_A5;
  undefined4 in_USP;
  undefined2 in_stack_00000000;
  undefined4 in_stack_00000002;
  
  puVar1 = *(undefined1 **)(unaff_A5 + -0x7dfc);
  *puVar1 = 4;
  *(undefined4 *)(puVar1 + 8) = in_USP;
  *(undefined2 *)(puVar1 + 2) = in_stack_00000000;
  *(undefined4 *)(puVar1 + 4) = in_stack_00000002;
  FUN_00000290();
  return;
}



/* 00000a30 vector_a30 */

void vector_a30(void)

{
  short in_D0w;
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + -0x8000 + (int)in_D0w) = 2;
  *(undefined1 *)(unaff_A5 + -0x7fff + (int)in_D0w) = 0;
  return;
}



/* 00000a4c vector_a4c */

void vector_a4c(void)

{
  short in_D0w;
  undefined1 in_D1b;
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + -0x8000 + (int)in_D0w) = 4;
  *(undefined1 *)(unaff_A5 + -0x7fff + (int)in_D0w) = in_D1b;
  return;
}



/* 00000a5c FUN_00000a5c */

void FUN_00000a5c(void)

{
  __m68k_trap(7);
  return;
}



/* 00000a60 vector_a60 */

void vector_a60(void)

{
  undefined2 *puVar1;
  undefined2 in_D0w;
  undefined2 in_D1w;
  undefined4 in_A0;
  int unaff_A5;
  
  if (*(short *)(unaff_A5 + -0x7df4) != 0) {
    puVar1 = (undefined2 *)**(undefined4 **)(unaff_A5 + -0x7df8);
    *(undefined4 **)(unaff_A5 + -0x7df8) = *(undefined4 **)(unaff_A5 + -0x7df8) + 1;
    *(short *)(unaff_A5 + -0x7df4) = *(short *)(unaff_A5 + -0x7df4) + -1;
    *puVar1 = 0xc00;
    *(undefined4 *)(puVar1 + 2) = in_A0;
    puVar1[8] = in_D0w;
    puVar1[9] = in_D1w;
  }
  return;
}



/* 00000a92 vector_a92 */

void vector_a92(void)

{
  char in_D1b;
  short sVar1;
  undefined4 *puVar2;
  char *pcVar3;
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + 0x2e8) = 0;
  pcVar3 = (char *)(unaff_A5 + -0x7f00);
  sVar1 = 7;
  while ((*pcVar3 == '\0' || (in_D1b != pcVar3[0x16]))) {
    pcVar3 = pcVar3 + 0x20;
    sVar1 = sVar1 + -1;
    if (sVar1 == -1) {
      return;
    }
  }
  pcVar3[0x10] = '\0';
  pcVar3[0x11] = '\0';
  pcVar3[0x12] = '\0';
  pcVar3[0x13] = '\0';
  pcVar3[0x14] = '\0';
  pcVar3[0x15] = '\0';
  pcVar3[0x16] = '\0';
  pcVar3[0x17] = '\0';
  pcVar3[0x18] = '\0';
  pcVar3[0x19] = '\0';
  pcVar3[0x1a] = '\0';
  pcVar3[0x1b] = '\0';
  pcVar3[0x1c] = '\0';
  pcVar3[0x1d] = '\0';
  pcVar3[0x1e] = '\0';
  pcVar3[0x1f] = '\0';
  *pcVar3 = '\0';
  puVar2 = (undefined4 *)(*(int *)(unaff_A5 + -0x7df8) + -4);
  *puVar2 = pcVar3;
  *(undefined4 **)(unaff_A5 + -0x7df8) = puVar2;
  *(short *)(unaff_A5 + -0x7df4) = *(short *)(unaff_A5 + -0x7df4) + 1;
  return;
}



/* 00000adc FUN_00000adc */

void FUN_00000adc(void)

{
  undefined1 *puVar1;
  undefined4 *puVar2;
  int unaff_A5;
  
  __m68k_trap(9);
  puVar1 = *(undefined1 **)(unaff_A5 + -0x7dfc);
  *(undefined4 *)(puVar1 + 0x10) = 0;
  *(undefined4 *)(puVar1 + 0x14) = 0;
  *(undefined4 *)(puVar1 + 0x18) = 0;
  *(undefined4 *)(puVar1 + 0x1c) = 0;
  *puVar1 = 0;
  puVar2 = (undefined4 *)(*(int *)(unaff_A5 + -0x7df8) + -4);
  *puVar2 = puVar1;
  *(undefined4 **)(unaff_A5 + -0x7df8) = puVar2;
  *(short *)(unaff_A5 + -0x7df4) = *(short *)(unaff_A5 + -0x7df4) + 1;
  FUN_00000290();
  return;
}



/* 00000ade vector_ade */

void vector_ade(void)

{
  undefined1 *puVar1;
  undefined4 *puVar2;
  int unaff_A5;
  
  puVar1 = *(undefined1 **)(unaff_A5 + -0x7dfc);
  *(undefined4 *)(puVar1 + 0x10) = 0;
  *(undefined4 *)(puVar1 + 0x14) = 0;
  *(undefined4 *)(puVar1 + 0x18) = 0;
  *(undefined4 *)(puVar1 + 0x1c) = 0;
  *puVar1 = 0;
  puVar2 = (undefined4 *)(*(int *)(unaff_A5 + -0x7df8) + -4);
  *puVar2 = puVar1;
  *(undefined4 **)(unaff_A5 + -0x7df8) = puVar2;
  *(short *)(unaff_A5 + -0x7df4) = *(short *)(unaff_A5 + -0x7df4) + 1;
  FUN_00000290();
  return;
}



/* 00000b12 vector_b12 */

void vector_b12(void)

{
  short in_D0w;
  undefined2 in_D1w;
  undefined2 unaff_D2w;
  undefined4 in_A0;
  int unaff_A5;
  
  *(undefined2 *)(unaff_A5 + -0x8000 + (int)in_D0w) = 0xc00;
  *(undefined4 *)(unaff_A5 + -0x7ffc + (int)in_D0w) = in_A0;
  *(undefined2 *)(unaff_A5 + -0x7ff0 + (int)in_D0w) = in_D1w;
  *(undefined2 *)(unaff_A5 + -0x7fee + (int)in_D0w) = unaff_D2w;
  return;
}



/* 00000b2a FUN_00000b2a */

void FUN_00000b2a(void)

{
  __m68k_trap(0xb);
  return;
}



/* 00000b2e vector_b2e */

void vector_b2e(void)

{
  short sVar1;
  undefined4 *puVar2;
  char *pcVar3;
  int unaff_A5;
  
  pcVar3 = (char *)(unaff_A5 + -0x7f00);
  sVar1 = 7;
  do {
    if (*pcVar3 != '\0') {
      pcVar3[0x10] = '\0';
      pcVar3[0x11] = '\0';
      pcVar3[0x12] = '\0';
      pcVar3[0x13] = '\0';
      pcVar3[0x14] = '\0';
      pcVar3[0x15] = '\0';
      pcVar3[0x16] = '\0';
      pcVar3[0x17] = '\0';
      pcVar3[0x18] = '\0';
      pcVar3[0x19] = '\0';
      pcVar3[0x1a] = '\0';
      pcVar3[0x1b] = '\0';
      pcVar3[0x1c] = '\0';
      pcVar3[0x1d] = '\0';
      pcVar3[0x1e] = '\0';
      pcVar3[0x1f] = '\0';
      *pcVar3 = '\0';
      puVar2 = (undefined4 *)(*(int *)(unaff_A5 + -0x7df8) + -4);
      *puVar2 = pcVar3;
      *(undefined4 **)(unaff_A5 + -0x7df8) = puVar2;
      *(short *)(unaff_A5 + -0x7df4) = *(short *)(unaff_A5 + -0x7df4) + 1;
    }
    pcVar3 = pcVar3 + 0x20;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00000b6c FUN_00000b6c */

void FUN_00000b6c(void)

{
  __m68k_trap(0xc);
  return;
}



/* 00000b70 vector_b70 */

void vector_b70(void)

{
  char in_D0b;
  
  if (in_D0b == '\0') {
    return;
  }
  return;
}



/* 00000b82 vector_b82 */

void vector_b82(void)

{
  undefined2 *puVar1;
  undefined4 in_A0;
  int unaff_A5;
  
  puVar1 = *(undefined2 **)(unaff_A5 + -0x7dfc);
  *puVar1 = 0xc00;
  *(undefined4 *)(puVar1 + 2) = in_A0;
  FUN_00000290();
  return;
}



/* 00000b94 vector_b94 */

void vector_b94(void)

{
  return;
}



/* 00000d24 FUN_00000d24 */

void FUN_00000d24(void)

{
  byte bVar1;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x349) == '\0') {
    if (8 < *(byte *)(unaff_A5 + 0x2e9)) {
LAB_00000d16:
      *(byte *)(unaff_A5 + 0x2e7) = *(byte *)(unaff_A5 + 0x2e7) & 0xf3;
      return;
    }
  }
  else {
    if (*(char *)(unaff_A5 + 0x34a) != '\0') {
      bVar1 = *(byte *)(unaff_A5 + 0x2e7) | 0xc;
      if (*(char *)(unaff_A5 + 0x2e9) != '\0') {
        bVar1 = bVar1 & 0xfb;
      }
      if (*(char *)(unaff_A5 + 0x34b) != '\0') {
        bVar1 = bVar1 & 0xf7;
      }
      *(byte *)(unaff_A5 + 0x2e7) = bVar1;
      return;
    }
    if (1 < *(byte *)(unaff_A5 + 0x2e9)) goto LAB_00000d16;
  }
  *(byte *)(unaff_A5 + 0x2e7) = *(byte *)(unaff_A5 + 0x2e7) | 0xc;
  return;
}



/* 00000e90 FUN_00000e90 */

void FUN_00000e90(void)

{
  int unaff_A5;
  
  while (*(short *)(unaff_A5 + -0x7df4) == 0) {
    FUN_000009d0();
  }
  FUN_00000a5c();
  return;
}



/* 0000189e FUN_0000189e */

void FUN_0000189e(void)

{
  short unaff_D7w;
  int *extraout_A1;
  int unaff_A5;
  
  do {
    FUN_000018ae();
    unaff_D7w = unaff_D7w + -1;
  } while (unaff_D7w != -1);
  *(int *)(&DAT_0000614a + unaff_A5) = *extraout_A1 + *(int *)(&DAT_0000614a + unaff_A5);
  return;
}



/* 000018ae FUN_000018ae */

void FUN_000018ae(void)

{
  short unaff_D2w;
  short sVar1;
  uint unaff_D7;
  ushort *in_A0;
  ushort *puVar2;
  uint *in_A1;
  
  if (((*in_A0 & 0xf000) != 0xf000) && ((unaff_D2w + *in_A0 & 0xf000) != 0xc000)) {
    sVar1 = 3;
    do {
      *in_A0 = unaff_D2w + *in_A0;
      in_A0[1] = unaff_D2w + in_A0[1];
      puVar2 = in_A0 + 3;
      in_A0[2] = unaff_D2w + in_A0[2];
      in_A0 = in_A0 + 4;
      *puVar2 = unaff_D2w + *puVar2;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
    return;
  }
  *in_A1 = *in_A1 & ~(1 << (unaff_D7 & 0x1f));
  return;
}



/* 000018e6 FUN_000018e6 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_000018e6(void)

{
  short sVar1;
  undefined2 *puVar2;
  undefined2 *puVar3;
  int unaff_A5;
  
  if (((*(char *)(unaff_A5 + 0x2e3) != '\0') && (*(char *)(unaff_A5 + 0x2e4) == '\0')) &&
     ((*(byte *)(unaff_A5 + 0x94) & 0x20) != 0)) {
    _DAT_0080410c = 0xffc0;
    _DAT_0080410e = 0;
    _DAT_00804166 = *(ushort *)(unaff_A5 + 0x4e) & 0xf | 0x12c0;
    puVar2 = (undefined2 *)&DAT_0090d780;
    sVar1 = 0x1f;
    do {
      puVar3 = puVar2 + 1;
      *puVar2 = 0x41;
      puVar2 = puVar2 + 2;
      *puVar3 = 0;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
  }
  return;
}



/* 000018ec FUN_000018ec */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_000018ec(void)

{
  undefined2 uVar1;
  short in_D0w;
  short sVar2;
  undefined2 *puVar3;
  undefined2 *puVar4;
  int unaff_A5;
  
  uVar1 = *(undefined2 *)(&DAT_00001940 + (short)(in_D0w * 2));
  if (((*(char *)(unaff_A5 + 0x2e3) != '\0') && (*(char *)(unaff_A5 + 0x2e4) == '\0')) &&
     ((*(byte *)(unaff_A5 + 0x94) & 0x20) != 0)) {
    _DAT_0080410c = 0xffc0;
    _DAT_0080410e = 0;
    _DAT_00804166 = *(ushort *)(unaff_A5 + 0x4e) & 0xf | 0x12c0;
    puVar3 = (undefined2 *)&DAT_0090d780;
    sVar2 = 0x1f;
    do {
      puVar4 = puVar3 + 1;
      *puVar3 = uVar1;
      puVar3 = puVar3 + 2;
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
    } while (sVar2 != -1);
  }
  return;
}



/* 00001950 FUN_00001950 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00001950(void)

{
  short sVar1;
  undefined2 *puVar2;
  undefined2 *puVar3;
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + 0x2e3) != '\0') && ((*(byte *)(unaff_A5 + 0x94) & 0x20) != 0)) {
    _DAT_0080410c = _DAT_ffff805c;
    _DAT_0080410e = _DAT_ffff805e;
    _DAT_00804166 = *(undefined2 *)(unaff_A5 + 0x4e);
    puVar2 = (undefined2 *)&DAT_0090d780;
    sVar1 = 0x1f;
    do {
      puVar3 = puVar2 + 1;
      *puVar2 = 0x20;
      puVar2 = puVar2 + 2;
      *puVar3 = 0;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
  }
  return;
}



/* 0000197c vector_197c */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined8 vector_197c(void)

{
  undefined4 in_D0;
  undefined4 in_D1;
  int unaff_A5;
  
  if ((&DAT_000061ca)[unaff_A5] == '\0') {
    if (*(char *)(unaff_A5 + 0x38c) == '\0') {
      _DAT_008040e0 = *(undefined2 *)(unaff_A5 + 0x2c4);
      *(undefined1 *)(unaff_A5 + 0x2c8) = 0;
      *(undefined1 *)(unaff_A5 + 0x38d) = 1;
    }
    FUN_00001a6c();
    FUN_00010efc();
    FUN_00010efc();
    return CONCAT44(in_D0,in_D1);
  }
  if (*(char *)(unaff_A5 + 0x364) == '\0') {
    _DAT_008040e0 = *(undefined2 *)(unaff_A5 + 0x2c4);
    *(undefined1 *)(unaff_A5 + 0x2c8) = 0;
    *(undefined1 *)(unaff_A5 + 0x38d) = 1;
  }
  *(undefined1 *)(unaff_A5 + 0x364) = 0;
  FUN_00001a6c();
  FUN_00010efc();
  FUN_00010efc();
  return CONCAT44(in_D0,in_D1);
}



/* 000019ea vector_19ea */

undefined8 vector_19ea(void)

{
  undefined4 in_D0;
  undefined4 in_D1;
  
  FUN_00002208();
  FUN_00010efc();
  return CONCAT44(in_D0,in_D1);
}



/* 000019fe vector_19fe */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined8 vector_19fe(void)

{
  undefined4 in_D0;
  undefined4 in_D1;
  int unaff_A5;
  
  if ((&DAT_000061ca)[unaff_A5] == '\0') {
    if (*(char *)(unaff_A5 + 0x38c) == '\0') {
      _DAT_008040e0 = *(undefined2 *)(unaff_A5 + 0x2c4);
      *(undefined1 *)(unaff_A5 + 0x2c8) = 0;
      *(undefined1 *)(unaff_A5 + 0x38d) = 1;
    }
    FUN_00001a6c();
    FUN_00010efc();
    FUN_00010efc();
    return CONCAT44(in_D0,in_D1);
  }
  if (*(char *)(unaff_A5 + 0x364) == '\0') {
    _DAT_008040e0 = *(undefined2 *)(unaff_A5 + 0x2c4);
    *(undefined1 *)(unaff_A5 + 0x2c8) = 0;
    *(undefined1 *)(unaff_A5 + 0x38d) = 1;
  }
  *(undefined1 *)(unaff_A5 + 0x364) = 0;
  FUN_00001a6c();
  FUN_00010efc();
  FUN_00010efc();
  return CONCAT44(in_D0,in_D1);
}



/* 00001a6c FUN_00001a6c */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00001a6c(void)

{
  char cVar1;
  ushort uVar2;
  byte bVar3;
  uint uVar4;
  short sVar5;
  byte bVar6;
  char *pcVar7;
  
  _DAT_00804108 = _DAT_ffff802e;
  _DAT_00804102 = _DAT_ffff8028;
  if (DAT_ffff8352 == '\0') {
    if (DAT_ffff8353 != '\0') {
      _DAT_ffff8060 = _DAT_ffff8036 + -0x40;
      _DAT_ffff8064 = _DAT_ffff803a + -0x40;
      _DAT_ffff8062 = 0x300 - _DAT_ffff8038;
      _DAT_ffff8066 = 0x700 - _DAT_ffff803c;
    }
    _DAT_00804104 = _DAT_ffff802a;
    _DAT_00804106 = _DAT_ffff802c;
  }
  else {
    if (DAT_ffff8353 == '\0') {
      _DAT_ffff8060 = _DAT_ffff8036 + -0x40;
      _DAT_ffff8064 = _DAT_ffff803a + -0x40;
      _DAT_ffff8062 = 0x300 - _DAT_ffff8038;
      _DAT_ffff8066 = 0x700 - _DAT_ffff803c;
    }
    _DAT_00804104 = 0x9180;
    _DAT_00804106 = 0x91c0;
  }
  _DAT_00804120 = _DAT_ffff8070;
  _DAT_00400008 = _DAT_ffff8058;
  _DAT_0040000a = _DAT_ffff805a;
  DAT_ffff8095 = DAT_ffff82eb ^ DAT_ffff82de;
  _DAT_00804122 = _DAT_ffff8048 | (ushort)DAT_ffff8095 << 8;
  _DAT_00400002 = 0x7d;
  if ((_DAT_00804122 & 0x8000) != 0) {
    _DAT_00400002 = 0x8e;
  }
  _DAT_00400002 = _DAT_ffff8052 | _DAT_00400002;
  _DAT_00804166 = _DAT_ffff804e;
  _DAT_00400004 = _DAT_ffff8054;
  _DAT_00400006 = _DAT_ffff8056;
  if (DAT_ffff8354 == '\0') {
    _DAT_00804040 =
         _DAT_ffff834e | _DAT_ffff834c | (byte)(DAT_ffff82e7 << 2) & 0x30 | DAT_ffff82e7 & 3;
  }
  _DAT_ffff8350 = DAT_00804030;
  uVar2 = ~DAT_00804020;
  bVar3 = (byte)(uVar2 >> 8);
  bVar6 = bVar3 >> 4 & 3 | (byte)(uVar2 >> 4) & 0x30;
  if ((uVar2 >> 1 & 1) != 0) {
    bVar6 = bVar6 | 0x40;
  }
  if ((uVar2 >> 2 & 1) != 0) {
    bVar6 = bVar6 | 4;
  }
  uVar4 = (uint)_DAT_ffff807e >> 8;
  _DAT_ffff807e = CONCAT13(bVar6,(int3)uVar4);
  if ((DAT_ffff8345 != '\0') && (DAT_ffff8346 = 0, (bVar6 & 0x40) != 0)) {
    DAT_ffff8346 = 1;
  }
  _DAT_ffff8088 = _DAT_ffff8086;
  _DAT_ffff808c = _DAT_ffff808a;
  _DAT_ffff8086 = CONCAT11((char)~DAT_00804010,(char)~_DAT_00804000) & 0x7ff;
  _DAT_ffff808a =
       CONCAT11(bVar3 >> 4 & 4 | (byte)((~DAT_00804010 & 0x30) >> 4),
                (char)((ushort)~_DAT_00804000 >> 8));
  FUN_00001db2();
  _DAT_00804170 = _DAT_ffff8050;
  if (DAT_ffff8352 == '\0') {
    if (DAT_ffff8353 != '\0') goto LAB_00001c6c;
LAB_00001c5c:
    _DAT_0080410a = _DAT_ffff8030;
  }
  else {
    if (DAT_ffff8353 == '\0') goto LAB_00001c5c;
LAB_00001c6c:
    _DAT_0080410a = 0x9240;
  }
  DAT_ffff8353 = DAT_ffff8352;
  FUN_000018e6();
  FUN_000079d2();
  FUN_000022e2();
  FUN_00008f5e();
  FUN_00001d5c();
  if ((DAT_ffff838e != '\0') && (DAT_ffff0080 != '\0')) {
    DAT_ffff839b = DAT_ffff839b + '\x01';
    if (DAT_ffff839b != '<') goto LAB_00001cb2;
    FUN_00008d9a();
  }
  DAT_ffff839b = '\0';
LAB_00001cb2:
  if (DAT_ffff82bb != '\0') {
    DAT_ffff82bb = DAT_ffff82bb + -1;
    FUN_00007cf2();
    if ((((DAT_ffff82e6 != '\0') && (DAT_ffff82e4 == '\0')) && (DAT_ffff82df == '\0')) &&
       ((DAT_ffff8c62 == '\0' && (DAT_ffff82e6 != '\0')))) {
      FUN_00002ca6();
    }
  }
  DAT_ffff82e2 = (undefined1)((DAT_ffff8094 & 8) >> 3);
  DAT_ffff831c = DAT_ffff8094 >> 7;
  if (DAT_ffff831b != '\0') {
    DAT_ffff82e3 = DAT_ffff831c;
  }
  DAT_ffff82ef = 0;
  if ((DAT_ffff82e3 != 0) && ((DAT_ffff8094 & 2) != 0)) {
    DAT_ffff82ef = 1;
  }
  DAT_ffff801c = DAT_ffff801c + '\x01';
  DAT_ffff020e = 0xff;
  DAT_ffff82ee = 0;
  pcVar7 = &DAT_ffff0000;
  sVar5 = 0xf;
  do {
    if ((*pcVar7 == '\x01') && (cVar1 = pcVar7[1] + -1, pcVar7[1] = cVar1, cVar1 == '\0')) {
      *pcVar7 = '\x04';
    }
    pcVar7 = pcVar7 + 0x20;
    sVar5 = sVar5 + -1;
  } while (sVar5 != -1);
  sVar5 = 0x50;
  do {
    sVar5 = sVar5 + -1;
  } while (sVar5 != -1);
  return;
}



/* 00001d5c FUN_00001d5c */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00001d5c(void)

{
  short sVar1;
  undefined4 *puVar2;
  undefined4 *puVar3;
  undefined4 *puVar4;
  undefined4 *puVar5;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x38d) != '\0') {
    *(undefined1 *)(unaff_A5 + 0x38d) = 0;
    if (*(char *)(unaff_A5 + 0x2c6) == '\0') {
      if (*(char *)(unaff_A5 + 0x2c7) == '\0') {
        return;
      }
    }
    else {
      *(undefined1 *)(unaff_A5 + 0x2c6) = 0;
      puVar2 = (undefined4 *)&DAT_00708000;
      sVar1 = 0x1f5;
      do {
        puVar4 = puVar2 + 1;
        *puVar2 = 0;
        puVar2 = puVar2 + 2;
        *puVar4 = 0;
        sVar1 = sVar1 + -1;
      } while (sVar1 != -1);
      _DAT_007095f2 = 8000;
    }
    *(undefined1 *)(unaff_A5 + 0x2c7) = 0;
    puVar2 = (undefined4 *)&DAT_00708fb0;
    puVar4 = (undefined4 *)&DAT_00910000;
    sVar1 = 200;
    do {
      puVar5 = puVar4 + 1;
      puVar3 = puVar2 + 1;
      *puVar2 = *puVar4;
      puVar4 = puVar4 + 2;
      puVar2 = puVar2 + 2;
      *puVar3 = *puVar5;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
  }
  return;
}



/* 00001d66 FUN_00001d66 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00001d66(void)

{
  short sVar1;
  undefined4 *puVar2;
  undefined4 *puVar3;
  undefined4 *puVar4;
  undefined4 *puVar5;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x2c6) == '\0') {
    if (*(char *)(unaff_A5 + 0x2c7) == '\0') {
      return;
    }
  }
  else {
    *(undefined1 *)(unaff_A5 + 0x2c6) = 0;
    puVar2 = (undefined4 *)&DAT_00708000;
    sVar1 = 0x1f5;
    do {
      puVar4 = puVar2 + 1;
      *puVar2 = 0;
      puVar2 = puVar2 + 2;
      *puVar4 = 0;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
    _DAT_007095f2 = 8000;
  }
  *(undefined1 *)(unaff_A5 + 0x2c7) = 0;
  puVar2 = (undefined4 *)&DAT_00708fb0;
  puVar4 = (undefined4 *)&DAT_00910000;
  sVar1 = 200;
  do {
    puVar5 = puVar4 + 1;
    puVar3 = puVar2 + 1;
    *puVar2 = *puVar4;
    puVar4 = puVar4 + 2;
    puVar2 = puVar2 + 2;
    *puVar3 = *puVar5;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00001db2 FUN_00001db2 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00001db2(void)

{
  short sVar1;
  ushort uVar2;
  int unaff_A5;
  
  *(char *)(unaff_A5 + 0x343) = *(char *)(unaff_A5 + 0xece);
  if (*(char *)(unaff_A5 + 0xece) == '\0') {
    *(undefined2 *)(unaff_A5 + 0x72) = *(undefined2 *)(unaff_A5 + 0x5c);
    *(undefined2 *)(unaff_A5 + 0x74) = *(undefined2 *)(unaff_A5 + 0x5e);
    *(undefined2 *)(unaff_A5 + 0x76) = *(undefined2 *)(unaff_A5 + 0x60);
    *(undefined2 *)(unaff_A5 + 0x78) = *(undefined2 *)(unaff_A5 + 0x62);
    *(undefined2 *)(unaff_A5 + 0x7a) = *(undefined2 *)(unaff_A5 + 100);
    *(undefined2 *)(unaff_A5 + 0x7c) = *(undefined2 *)(unaff_A5 + 0x66);
    *(undefined2 *)(unaff_A5 + 0xff8) = *(undefined2 *)(unaff_A5 + 0xff6);
    *(undefined2 *)(unaff_A5 + 0xff6) = *(undefined2 *)(unaff_A5 + 0xff4);
    _DAT_00804114 = *(undefined2 *)(unaff_A5 + 100);
    _DAT_0080410c = *(undefined2 *)(unaff_A5 + 0x5c);
    _DAT_00804110 = *(undefined2 *)(unaff_A5 + 0x60);
    _DAT_00804112 = *(undefined2 *)(unaff_A5 + 0x62);
    _DAT_0080410e = *(undefined2 *)(unaff_A5 + 0x5e);
    _DAT_00804116 = *(undefined2 *)(unaff_A5 + 0x66);
  }
  else {
    *(undefined2 *)(unaff_A5 + 0x72) = *(undefined2 *)(unaff_A5 + 0x5c);
    *(undefined2 *)(unaff_A5 + 0x74) = *(undefined2 *)(unaff_A5 + 0x5e);
    *(undefined2 *)(unaff_A5 + 0x76) = *(undefined2 *)(unaff_A5 + 0x60);
    *(undefined2 *)(unaff_A5 + 0x78) = *(undefined2 *)(unaff_A5 + 0x62);
    *(undefined2 *)(unaff_A5 + 0x7a) = *(undefined2 *)(unaff_A5 + 100);
    *(undefined2 *)(unaff_A5 + 0x7c) = *(undefined2 *)(unaff_A5 + 0x66);
    *(undefined2 *)(unaff_A5 + 0xff8) = *(undefined2 *)(unaff_A5 + 0xff6);
    *(undefined2 *)(unaff_A5 + 0xff6) = *(undefined2 *)(unaff_A5 + 0xff4);
    sVar1 = *(short *)(unaff_A5 + 0xcb0) * 2;
    if (*(char *)(unaff_A5 + 0x2de) == '\0') {
      (*(code *)(&DAT_00001f34 + *(short *)(&DAT_00001f34 + sVar1)))();
    }
    else {
      (*(code *)(&DAT_00001f5c + *(short *)(&DAT_00001f5c + sVar1)))();
    }
  }
  *(short *)(unaff_A5 + 0x5c) = *(short *)(unaff_A5 + 0x32) + -0x40;
  *(short *)(unaff_A5 + 0x60) = *(short *)(unaff_A5 + 0x36) + -0x40;
  *(short *)(unaff_A5 + 100) = *(short *)(unaff_A5 + 0x3a) + -0x40;
  _DAT_00804118 = *(undefined2 *)(unaff_A5 + 0x68);
  uVar2 = *(ushort *)(unaff_A5 + 0x3e);
  if (*(char *)(unaff_A5 + 0x95) < '\0') {
    uVar2 = (uVar2 ^ 0x1e0) + 0x20;
  }
  *(ushort *)(unaff_A5 + 0x68) = uVar2;
  _DAT_0080411c = *(undefined2 *)(unaff_A5 + 0x6c);
  uVar2 = *(ushort *)(unaff_A5 + 0x42);
  if (*(char *)(unaff_A5 + 0x95) < '\0') {
    uVar2 = (uVar2 ^ 0x1e0) + 0x20;
  }
  *(ushort *)(unaff_A5 + 0x6c) = uVar2;
  *(short *)(unaff_A5 + 0x5e) = 0x100 - *(short *)(unaff_A5 + 0x34);
  *(short *)(unaff_A5 + 0x62) = 0x300 - *(short *)(unaff_A5 + 0x38);
  *(short *)(unaff_A5 + 0x66) = 0x700 - *(short *)(unaff_A5 + 0x3c);
  *(short *)(unaff_A5 + 0x70) = 0x300 - *(short *)(unaff_A5 + 0x46);
  _DAT_0080411a = *(undefined2 *)(unaff_A5 + 0x6a);
  uVar2 = *(ushort *)(unaff_A5 + 0x40);
  if (*(char *)(unaff_A5 + 0x95) < '\0') {
    uVar2 = uVar2 ^ 0x100;
  }
  *(ushort *)(unaff_A5 + 0x6a) = uVar2;
  _DAT_0080411e = *(undefined2 *)(unaff_A5 + 0x6e);
  uVar2 = *(ushort *)(unaff_A5 + 0x44);
  if (*(char *)(unaff_A5 + 0x95) < '\0') {
    uVar2 = uVar2 ^ 0x100;
  }
  *(ushort *)(unaff_A5 + 0x6e) = uVar2;
  return;
}



/* 00002208 FUN_00002208 */

void FUN_00002208(void)

{
  short sVar1;
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + 0x343) != '\0') && ((ushort)(DAT_00804152 + 3U) < 4)) {
    sVar1 = *(short *)(unaff_A5 + 0xcb0) * 2;
    if (*(char *)(unaff_A5 + 0x2de) == '\0') {
                    /* WARNING: Could not recover jumptable at 0x0000222c. Too many branches */
                    /* WARNING: Treating indirect jump as call */
      (*(code *)(&DAT_00002238 + *(short *)(&DAT_00002238 + sVar1)))();
      return;
    }
                    /* WARNING: Could not recover jumptable at 0x00002234. Too many branches */
                    /* WARNING: Treating indirect jump as call */
    (*(code *)(&DAT_00002260 + *(short *)(&DAT_00002260 + sVar1)))();
    return;
  }
  return;
}



/* 0000228c FUN_0000228c */

byte FUN_0000228c(void)

{
  byte bVar1;
  byte bVar2;
  byte bVar3;
  byte bVar4;
  int unaff_A5;
  int unaff_A6;
  
  bVar1 = *(byte *)(unaff_A5 + 0x81);
  bVar2 = *(byte *)(unaff_A5 + 0x80);
  bVar3 = *(byte *)(unaff_A5 + 0x7f);
  bVar4 = *(byte *)(unaff_A5 + 0x7e);
  *(char *)(unaff_A6 + 7) =
       ((((bVar1 & 1) != 0) * '\x02' | (bVar2 & 1) != 0) * '\x02' | (bVar3 & 1) != 0) * '\x02' |
       (bVar4 & 1) != 0;
  *(char *)(unaff_A6 + 0xf) =
       ((((bVar1 >> 1 & 1) != 0) * '\x02' | (bVar2 >> 1 & 1) != 0) * '\x02' | (bVar3 >> 1 & 1) != 0)
       * '\x02' | (bVar4 >> 1 & 1) != 0;
  *(char *)(unaff_A5 + 0x2ba) =
       ((((bVar1 >> 2 & 1) != 0) * '\x02' | (bVar2 >> 2 & 1) != 0) * '\x02' | (bVar3 >> 2 & 1) != 0)
       * '\x02' | (bVar4 >> 2 & 1) != 0;
  return bVar4 >> 3;
}



/* 000022e2 FUN_000022e2 */

void FUN_000022e2(void)

{
  byte bVar1;
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + 0x3b1) == '\0') && (*(char *)(unaff_A5 + 0x2e4) == '\0')) {
    FUN_0000228c();
    FUN_0000242a();
    FUN_00002374();
    FUN_00002374();
    if (*(char *)(unaff_A5 + 0x2ba) == '\x03') {
      if ((*(char *)(unaff_A5 + 0x3bf) != '\0') && (*(char *)(unaff_A5 + 0x38e) == '\0')) {
        *(int *)(unaff_A5 + 0x3b6) = *(int *)(unaff_A5 + 0x3b6) + 1;
        FUN_000084f8();
      }
      if (*(char *)(unaff_A5 + 0x38e) != '\0') {
        FUN_00008d56();
      }
      bVar1 = *(char *)(unaff_A5 + 0x2e9) + 1;
      if (9 < bVar1) {
        bVar1 = 9;
      }
      *(byte *)(unaff_A5 + 0x2e9) = bVar1;
      if ((*(char *)(unaff_A5 + 0x349) != '\0') && (*(char *)(unaff_A5 + 0x34a) != '\0')) {
        bVar1 = *(char *)(unaff_A5 + 0x34b) + 1;
        if (9 < bVar1) {
          bVar1 = 9;
        }
        *(byte *)(unaff_A5 + 0x34b) = bVar1;
      }
      *(char *)(unaff_A5 + 699) = *(char *)(unaff_A5 + 699) + '\x01';
    }
  }
  return;
}



/* 00002374 FUN_00002374 */

void FUN_00002374(void)

{
  char cVar1;
  int unaff_A5;
  char *unaff_A6;
  
  if (*unaff_A6 == '\0') {
    if (unaff_A6[7] == '\x03') {
      *unaff_A6 = *unaff_A6 + '\x01';
      unaff_A6[6] = 'x';
      return;
    }
  }
  else {
    if (unaff_A6[7] == '\f') {
      *(short *)(unaff_A5 + 0x300) = *(short *)(unaff_A5 + 0x300) + 1;
      *(char *)(unaff_A5 + 699) = *(char *)(unaff_A5 + 699) + '\x01';
      FUN_000023d2();
      *unaff_A6 = '\0';
      if ((*(char *)(unaff_A5 + 0x3bf) != '\0') && (*(char *)(unaff_A5 + 0x38e) == '\0')) {
        *(int *)(unaff_A5 + 0x3b2) = *(int *)(unaff_A5 + 0x3b2) + 1;
        FUN_000084da();
      }
      if (*(char *)(unaff_A5 + 0x38e) != '\0') {
        FUN_00008cce();
        return;
      }
      return;
    }
    cVar1 = unaff_A6[6] + -1;
    unaff_A6[6] = cVar1;
    if (cVar1 == '\0') {
      *unaff_A6 = '\0';
    }
  }
  return;
}



/* 000023d2 FUN_000023d2 */

void FUN_000023d2(void)

{
  byte bVar1;
  char unaff_D7b;
  byte *pbVar2;
  int unaff_A5;
  int unaff_A6;
  
  *(char *)(unaff_A5 + 0x38f) = *(char *)(unaff_A5 + 0x38f) + '\x01';
  *(char *)(unaff_A6 + 2) = *(char *)(unaff_A6 + 2) + '\x01';
  if ((*(char *)(unaff_A5 + 0x2e0) == '\0') && (*(char *)(unaff_A6 + 2) < *(char *)(unaff_A6 + 4)))
  {
    return;
  }
  pbVar2 = (byte *)(unaff_A5 + 0x2e9);
  if (((*(char *)(unaff_A5 + 0x349) != '\0') && (*(char *)(unaff_A5 + 0x34a) != '\0')) &&
     (unaff_D7b != '\0')) {
    pbVar2 = (byte *)(unaff_A5 + 0x34b);
  }
  bVar1 = *pbVar2 + *(char *)(unaff_A6 + 5);
  bcdAdjust(bVar1);
  *pbVar2 = bVar1;
  if (0x18 < *pbVar2) {
    *pbVar2 = 0x18;
  }
  *(undefined1 *)(unaff_A6 + 2) = 0;
  return;
}



/* 0000242a FUN_0000242a */

byte FUN_0000242a(void)

{
  byte bVar1;
  byte *in_A0;
  int unaff_A5;
  int unaff_A6;
  
  if (*(char *)(unaff_A6 + 3) == '\0') {
    bVar1 = 0;
    if (*(char *)(unaff_A5 + 0x38f) != '\0') {
      *(char *)(unaff_A5 + 0x38f) = *(char *)(unaff_A5 + 0x38f) + -1;
      bVar1 = in_A0[1] | *(byte *)(unaff_A5 + 0x2e7);
      *(byte *)(unaff_A5 + 0x2e7) = bVar1;
      *(undefined1 *)(unaff_A6 + 3) = 0x1e;
    }
  }
  else {
    bVar1 = *(char *)(unaff_A6 + 3) - 1;
    *(byte *)(unaff_A6 + 3) = bVar1;
    if (bVar1 == 0xf) {
      bVar1 = *in_A0 & *(byte *)(unaff_A5 + 0x2e7);
      *(byte *)(unaff_A5 + 0x2e7) = bVar1;
      return bVar1;
    }
  }
  return bVar1;
}



/* 000024a0 FUN_000024a0 */

void FUN_000024a0(void)

{
  FUN_000025a2();
  FUN_000025be();
  FUN_000025da();
  FUN_000025f6();
  return;
}



/* 000025a2 FUN_000025a2 */

void FUN_000025a2(void)

{
  FUN_00002754();
  return;
}



/* 000025be FUN_000025be */

void FUN_000025be(void)

{
  FUN_00002754();
  return;
}



/* 000025da FUN_000025da */

void FUN_000025da(void)

{
  FUN_00002754();
  return;
}



/* 000025f6 FUN_000025f6 */

void FUN_000025f6(void)

{
  FUN_00002754();
  return;
}



/* 000026fc FUN_000026fc */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_000026fc(void)

{
  _DAT_00900000 = _DAT_00900000 | 0xf000f000;
  _DAT_00900004 = _DAT_00900004 | 0xf000f000;
  _DAT_00900008 = _DAT_00900008 | 0xf000f000;
  _DAT_0090000c = _DAT_0090000c | 0xf000f000;
  _DAT_00900010 = _DAT_00900010 | 0xf000f000;
  _DAT_00900014 = _DAT_00900014 | 0xf000f000;
  _DAT_00900018 = _DAT_00900018 | 0xf000f000;
  _DAT_0090001c = _DAT_0090001c | 0xf000f000;
  return;
}



/* 00002754 FUN_00002754 */

void FUN_00002754(void)

{
  short sVar1;
  undefined4 *in_A0;
  undefined4 *puVar2;
  undefined4 *in_A1;
  undefined4 *puVar3;
  
  sVar1 = 0x1f;
  do {
    *in_A1 = *in_A0;
    in_A1[1] = in_A0[1];
    in_A1[2] = in_A0[2];
    in_A1[3] = in_A0[3];
    in_A1[4] = in_A0[4];
    in_A1[5] = in_A0[5];
    puVar2 = in_A0 + 7;
    puVar3 = in_A1 + 7;
    in_A1[6] = in_A0[6];
    in_A0 = in_A0 + 8;
    in_A1 = in_A1 + 8;
    *puVar3 = *puVar2;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00002822 FUN_00002822 */

void FUN_00002822(void)

{
  undefined4 *in_A0;
  undefined4 *in_A1;
  
  *in_A1 = *in_A0;
  in_A1[1] = in_A0[1];
  in_A1[2] = in_A0[2];
  in_A1[3] = in_A0[3];
  in_A1[4] = in_A0[4];
  in_A1[5] = in_A0[5];
  in_A1[6] = in_A0[6];
  in_A1[7] = in_A0[7];
  return;
}



/* 00002834 FUN_00002834 */

void FUN_00002834(void)

{
  int *in_A0;
  int *in_A1;
  
  *in_A1 = *in_A0 + -0xfff1000;
  in_A1[1] = in_A0[1] + -0xfff1000;
  in_A1[2] = in_A0[2] + -0xfff1000;
  in_A1[3] = in_A0[3] + -0xfff1000;
  in_A1[4] = in_A0[4] + -0xfff1000;
  in_A1[5] = in_A0[5] + -0xfff1000;
  in_A1[6] = in_A0[6] + -0xfff1000;
  in_A1[7] = in_A0[7] + -0xfff1000;
  return;
}



/* 00002944 FUN_00002944 */

void FUN_00002944(void)

{
  undefined1 in_D0b;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x363) == '\0') {
    (&DAT_00006371)[unaff_A5] = in_D0b;
    (&DAT_00006373)[unaff_A5] = in_D0b;
    (&DAT_00006375)[unaff_A5] = in_D0b;
    (&DAT_00006370)[unaff_A5] = 1;
    (&DAT_00006372)[unaff_A5] = 1;
    (&DAT_00006374)[unaff_A5] = 1;
    return;
  }
  (&DAT_00006371)[unaff_A5] = in_D0b;
  (&DAT_00006370)[unaff_A5] = 1;
  return;
}



/* 00002976 FUN_00002976 */

undefined2 FUN_00002976(void)

{
  undefined2 uVar1;
  int unaff_A5;
  
  uVar1 = FUN_00002944();
  *(undefined2 *)(unaff_A5 + 0x398) = uVar1;
  if (*(char *)(unaff_A5 + 0x363) == '\0') {
    do {
      FUN_000009d0();
    } while ((char)((&DAT_00006374)[unaff_A5] +
                   (&DAT_00006372)[unaff_A5] + (&DAT_00006370)[unaff_A5]) != '\0');
    return *(undefined2 *)(unaff_A5 + 0x398);
  }
  do {
    FUN_000009d0();
  } while ((&DAT_00006370)[unaff_A5] != '\0');
  return *(undefined2 *)(unaff_A5 + 0x398);
}



/* 000029d0 FUN_000029d0 */

void FUN_000029d0(void)

{
  char cVar1;
  char extraout_D1b;
  
  do {
    cVar1 = FUN_00002a0c();
  } while (extraout_D1b != cVar1);
  return;
}



/* 00002a0c FUN_00002a0c */

undefined1 FUN_00002a0c(void)

{
  undefined1 uVar1;
  char *extraout_A0;
  undefined1 *extraout_A1;
  int unaff_A5;
  
  do {
    if ((&DAT_00006380)[unaff_A5] != '\0') {
      *(undefined1 *)(unaff_A5 + 0x2e4) = 0;
      *(undefined1 *)(unaff_A5 + 0x2ed) = 0;
      FUN_00000962();
      uVar1 = FUN_00000984();
      return uVar1;
    }
    FUN_000009d0();
    FUN_00002a28();
  } while (*extraout_A0 == '\0');
  *extraout_A0 = '\0';
  return *extraout_A1;
}



/* 00002a28 FUN_00002a28 */

void FUN_00002a28(void)

{
  byte bVar1;
  char cVar2;
  undefined3 uVar3;
  undefined4 uVar4;
  int unaff_A5;
  
  if (*(char *)((int)&PTR_LAB_00006364 + unaff_A5) != '\0') {
    FUN_00000b6c();
    if (((&DAT_0000637e)[unaff_A5] == '\0') &&
       (bVar1 = *(byte *)(unaff_A5 + -0x6423), bVar1 != *(byte *)(unaff_A5 + -0x6424))) {
      (&DAT_0000637e)[unaff_A5] = 1;
      (&DAT_0000637f)[unaff_A5] = *(undefined1 *)(unaff_A5 + -0x641c + (int)(short)(ushort)bVar1);
      *(byte *)(unaff_A5 + -0x6423) = bVar1 + 1;
    }
    FUN_00000b6c();
    return;
  }
  uVar4 = FUN_00000b6c();
  if ((&DAT_00006376)[unaff_A5] == '\0') {
    cVar2 = *(char *)(unaff_A5 + -0x6421);
    uVar3 = (undefined3)((uint)uVar4 >> 8);
    uVar4 = CONCAT31(uVar3,cVar2);
    if (cVar2 != *(char *)(unaff_A5 + -0x6422)) {
      (&DAT_00006376)[unaff_A5] = 1;
      (&DAT_00006377)[unaff_A5] = *(undefined1 *)(unaff_A5 + -0x631c + (int)(short)uVar4);
      uVar4 = CONCAT31(uVar3,cVar2 + '\x01');
      *(char *)(unaff_A5 + -0x6421) = cVar2 + '\x01';
    }
  }
  if (*(char *)(unaff_A5 + 0x363) == '\0') {
    if ((&DAT_00006378)[unaff_A5] == '\0') {
      cVar2 = *(char *)(unaff_A5 + -0x641f);
      uVar3 = (undefined3)((uint)uVar4 >> 8);
      uVar4 = CONCAT31(uVar3,cVar2);
      if (cVar2 != *(char *)(unaff_A5 + -0x6420)) {
        (&DAT_00006378)[unaff_A5] = 1;
        (&DAT_00006379)[unaff_A5] = *(undefined1 *)(unaff_A5 + -0x621c + (int)(short)uVar4);
        uVar4 = CONCAT31(uVar3,cVar2 + '\x01');
        *(char *)(unaff_A5 + -0x641f) = cVar2 + '\x01';
      }
    }
    if ((&DAT_00006376)[unaff_A5] == '\0') {
      cVar2 = *(char *)(unaff_A5 + -0x641d);
      if (cVar2 != *(char *)(unaff_A5 + -0x641e)) {
        (&DAT_0000637a)[unaff_A5] = 1;
        (&DAT_0000637b)[unaff_A5] =
             *(undefined1 *)
              (unaff_A5 + -0x611c + (int)(short)CONCAT31((int3)((uint)uVar4 >> 8),cVar2));
        *(char *)(unaff_A5 + -0x641d) = cVar2 + '\x01';
      }
    }
  }
  FUN_00000b6c();
  return;
}



/* 00002ae8 FUN_00002ae8 */

void FUN_00002ae8(void)

{
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + 0x2c7) = 1;
  if (*(char *)(unaff_A5 + 0x2c8) == '\0') {
    *(ushort *)(unaff_A5 + 0x2c4) = *(ushort *)(unaff_A5 + 0x2c4) ^ 1;
    *(undefined1 *)(unaff_A5 + 0x2c8) = 1;
  }
  return;
}



/* 00002aee FUN_00002aee */

void FUN_00002aee(void)

{
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x2c8) == '\0') {
    *(ushort *)(unaff_A5 + 0x2c4) = *(ushort *)(unaff_A5 + 0x2c4) ^ 1;
    *(undefined1 *)(unaff_A5 + 0x2c8) = 1;
  }
  return;
}



/* 00002b1c FUN_00002b1c */

void FUN_00002b1c(void)

{
  undefined2 *unaff_A5;
  
  FUN_00003440();
  *(undefined1 *)(unaff_A5 + 0x172) = 1;
  *(undefined1 *)(unaff_A5 + 0x31c2) = 1;
  *(undefined1 *)(unaff_A5 + 0x31c4) = 1;
  FUN_00000962();
  FUN_000009a8();
  FUN_000009a8();
  *unaff_A5 = 0;
  unaff_A5[3] = 0;
  unaff_A5[2] = 0;
  unaff_A5[1] = 0;
  unaff_A5[4] = 0;
  unaff_A5[5] = 0;
  unaff_A5[6] = 0;
  unaff_A5[7] = 0;
  unaff_A5[8] = 0;
  unaff_A5[9] = 0;
  unaff_A5[10] = 0;
  unaff_A5[0xb] = 0;
  FUN_00002c86();
  FUN_00000b2a();
  FUN_00000984();
  return;
}



/* 00002bd6 FUN_00002bd6 */

void FUN_00002bd6(void)

{
  int unaff_A5;
  
  (&DAT_00006169)[unaff_A5] = 1;
  FUN_00002ca6();
  do {
    FUN_000009d0();
  } while ((&DAT_00006169)[unaff_A5] != '\0');
  *(undefined1 *)(unaff_A5 + 0x352) = 0;
  return;
}



/* 00002bfc FUN_00002bfc */

void FUN_00002bfc(void)

{
  int unaff_A5;
  
  (&DAT_00006169)[unaff_A5] = 1;
  FUN_00002ca6();
  do {
    FUN_000009d0();
  } while ((&DAT_00006169)[unaff_A5] != '\0');
  return;
}



/* 00002c86 FUN_00002c86 */

void FUN_00002c86(void)

{
  short sVar1;
  undefined4 *puVar2;
  int unaff_A5;
  undefined4 *puVar3;
  
  *(undefined2 *)(unaff_A5 + 0x20) = 0;
  *(undefined2 *)(unaff_A5 + 0x1e) = 0;
  puVar2 = (undefined4 *)(unaff_A5 + 0xaa);
  sVar1 = 0x1f;
  do {
    puVar3 = puVar2 + 1;
    *puVar2 = 0xffffffff;
    puVar2 = puVar2 + 2;
    *puVar3 = 0xffffffff;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00002ca4 FUN_00002ca4 */

void FUN_00002ca4(void)

{
  short sVar1;
  undefined2 in_D0w;
  int unaff_A5;
  
  sVar1 = *(short *)(unaff_A5 + 0x1e);
  *(undefined2 *)(unaff_A5 + 0xaa + (int)sVar1) = in_D0w;
  *(undefined2 *)(unaff_A5 + 0xac + (int)sVar1) = 0;
  *(ushort *)(unaff_A5 + 0x1e) = sVar1 + 4U & 0xfc;
  return;
}



/* 00002ca6 FUN_00002ca6 */

void FUN_00002ca6(void)

{
  short sVar1;
  undefined2 in_D0w;
  undefined2 in_D1w;
  int unaff_A5;
  
  sVar1 = *(short *)(unaff_A5 + 0x1e);
  *(undefined2 *)(unaff_A5 + 0xaa + (int)sVar1) = in_D0w;
  *(undefined2 *)(unaff_A5 + 0xac + (int)sVar1) = in_D1w;
  *(ushort *)(unaff_A5 + 0x1e) = sVar1 + 4U & 0xfc;
  return;
}



/* 00002e96 FUN_00002e96 */

undefined1 FUN_00002e96(void)

{
  ushort uVar1;
  int unaff_A5;
  
  uVar1 = *(ushort *)(unaff_A5 + 0x2d0) & 0x202;
  *(ushort *)(unaff_A5 + 0x2d0) =
       (ushort)((char)(uVar1 >> 8) != (char)uVar1) << 0xf | *(ushort *)(unaff_A5 + 0x2d0) >> 1;
  return *(undefined1 *)(unaff_A5 + 0x2d1);
}



/* 00002ec4 FUN_00002ec4 */

void FUN_00002ec4(void)

{
  undefined2 *puVar1;
  char in_D0b;
  int in_A0;
  int unaff_A6;
  
  puVar1 = (undefined2 *)(in_A0 + *(short *)(in_A0 + CONCAT11(in_D0b >> 7,in_D0b * '\x02')));
  *(undefined2 **)(unaff_A6 + 0x1a) = puVar1;
  *(undefined2 *)(unaff_A6 + 0x18) = *puVar1;
  *(undefined2 *)(unaff_A6 + 0x14) = puVar1[1];
  return;
}



/* 00002ee2 FUN_00002ee2 */

void FUN_00002ee2(void)

{
  short sVar1;
  undefined4 *puVar2;
  int unaff_A6;
  
  sVar1 = *(short *)(unaff_A6 + 0x18) + -1;
  *(short *)(unaff_A6 + 0x18) = sVar1;
  if (sVar1 == 0) {
    puVar2 = (undefined4 *)(*(int *)(unaff_A6 + 0x1a) + 0x18);
    if (*(short *)(*(int *)(unaff_A6 + 0x1a) + 2) < 0) {
      puVar2 = (undefined4 *)*puVar2;
    }
    *(undefined4 **)(unaff_A6 + 0x1a) = puVar2;
    *(undefined2 *)(unaff_A6 + 0x18) = *(undefined2 *)puVar2;
    *(undefined2 *)(unaff_A6 + 0x14) = *(undefined2 *)((int)puVar2 + 2);
  }
  return;
}



/* 00002f50 FUN_00002f50 */

void FUN_00002f50(void)

{
  int unaff_A6;
  
  *(short *)(unaff_A6 + 0x3c) = *(short *)(unaff_A6 + 0x3c) - *(short *)(unaff_A6 + 0x40);
  *(short *)(unaff_A6 + 0x3e) = *(short *)(unaff_A6 + 0x3e) - *(short *)(unaff_A6 + 0x42);
  *(int *)(unaff_A6 + 6) = *(short *)(unaff_A6 + 0x3c) * 0x100 + *(int *)(unaff_A6 + 6);
  *(int *)(unaff_A6 + 10) = *(short *)(unaff_A6 + 0x3e) * 0x100 + *(int *)(unaff_A6 + 10);
  return;
}



/* 00003020 FUN_00003020 */

void FUN_00003020(void)

{
  uint uVar1;
  uint unaff_D2;
  uint unaff_D3;
  short sVar2;
  bool bVar3;
  
  uVar1 = 0;
  sVar2 = 0x1f;
  do {
    bVar3 = CARRY4(unaff_D3,unaff_D3);
    unaff_D3 = unaff_D3 * 2;
    uVar1 = uVar1 * 2 + (uint)bVar3;
    if (unaff_D2 <= uVar1) {
      uVar1 = uVar1 - unaff_D2;
      unaff_D3 = unaff_D3 + 1;
    }
    sVar2 = sVar2 + -1;
  } while (sVar2 != -1);
  return;
}



/* 000030d4 FUN_000030d4 */

/* WARNING: Control flow encountered bad instruction data */
/* WARNING: Instruction at (ram,0x000031a8) overlaps instruction at (ram,0x000031a6)
    */
/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

uint FUN_000030d4(void)

{
  undefined1 *puVar1;
  int iVar2;
  char cVar3;
  byte bVar4;
  ushort uVar6;
  ushort uVar7;
  ushort uVar8;
  ushort uVar9;
  short sVar10;
  uint uVar5;
  undefined2 uVar11;
  undefined4 in_D1;
  undefined1 uVar13;
  uint uVar12;
  uint extraout_D1;
  uint unaff_D2;
  uint unaff_D3;
  uint unaff_D4;
  byte bVar14;
  uint unaff_D5;
  short sVar15;
  ushort unaff_D6w;
  undefined1 unaff_D7b;
  ushort *puVar16;
  uint *in_A0;
  uint *puVar17;
  ushort *puVar18;
  uint *in_A1;
  uint *puVar19;
  uint *puVar20;
  uint *extraout_A1;
  uint *extraout_A1_00;
  uint *extraout_A1_01;
  uint *extraout_A1_02;
  byte *pbVar21;
  ushort *unaff_A2;
  ushort *unaff_A3;
  ushort *unaff_A4;
  ushort *unaff_A5;
  ushort *unaff_A6;
  ushort uVar22;
  char in_XF;
  bool bVar23;
  undefined1 in_stack_00000000;
  uint uStack_4;
  
  uVar6 = (ushort)unaff_D3;
  bVar14 = *(byte *)(unaff_A6 + 0x11);
  uVar11 = (undefined2)((uint)in_D1 >> 0x10);
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Could not find normalized switch variable to match jumptable */
  switch(bVar14) {
  default:
    return (uint)bVar14;
  case 1:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 3:
    *(byte *)in_A0 = *(byte *)in_A0 | 0x22;
    puVar16 = (ushort *)(*(int *)(unaff_A6 + 0xd) + 0x18);
    if (*(short *)(*(int *)(unaff_A6 + 0xd) + 2) < 0) {
      puVar16 = *(ushort **)puVar16;
    }
    *(ushort **)(unaff_A6 + 0xd) = puVar16;
    unaff_A6[0xc] = *puVar16;
    unaff_A6[10] = puVar16[1];
    return (uint)bVar14;
  case 4:
    break;
  }
  bVar14 = *(byte *)(unaff_A6 + 8);
  uVar5 = (uint)bVar14;
  uVar7 = (ushort)bVar14;
  sVar10 = *(short *)((int)&switchD_00003182::switchdataD_00003186 + (int)(short)uVar7);
  uVar12 = CONCAT22(uVar11,sVar10);
  bVar23 = sVar10 == 0;
  uVar22 = (ushort)unaff_A6;
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Could not find normalized switch variable to match jumptable */
  switch(bVar14) {
  case 0:
    uVar6 = unaff_A5[0xab5];
    *(ushort *)((short)uVar6 + -2) = uVar22;
    unaff_A5[0xab5] = (ushort)(ushort *)((short)uVar6 + -2);
    *(char *)(unaff_A5 + 0xaa3) = *(char *)(unaff_A5 + 0xaa3) + '\x01';
    return uVar5;
  case 1:
    *(undefined1 *)(unaff_A2 + -0x376f) = *(undefined1 *)(unaff_A2 + 0x20fc);
    unaff_A5[0xab6] = (ushort)in_A0;
    uVar13 = (undefined1)sVar10;
    *(undefined1 *)((int)unaff_A5 + 0x1549) = uVar13;
    *(undefined1 *)(unaff_A5 + 0xaa5) = uVar13;
    *(undefined1 *)((int)unaff_A5 + 0x154b) = uVar13;
    unaff_A5[0xaba] = 0x9142;
    unaff_A5[0xabb] = 0x9162;
    unaff_A5[0xabc] = 0x9182;
    *(undefined1 *)((int)unaff_A5 + 0x154d) = uVar13;
    *(undefined1 *)(unaff_A5 + 0xaa7) = uVar13;
    *(undefined1 *)((int)unaff_A5 + 0x154f) = uVar13;
    *(undefined1 *)(unaff_A5 + 0xaa8) = uVar13;
    *(undefined1 *)((int)unaff_A5 + 0x1551) = uVar13;
    *(undefined1 *)(unaff_A5 + 0xaa9) = uVar13;
    *(undefined1 *)((int)unaff_A5 + 0x1553) = uVar13;
    *(undefined1 *)(unaff_A5 + 0xaaa) = uVar13;
    unaff_A5[0xac1] = 0x91fa;
    unaff_A5[0xac2] = 0x9272;
    unaff_A5[0xac3] = 0x92ea;
    unaff_A5[0xac4] = 0x9362;
    unaff_A5[0xac5] = 0x93da;
    unaff_A5[0xac6] = 0x9452;
    unaff_A5[0xac7] = 0x94ca;
    unaff_A5[0xac8] = 0x9542;
    return uVar5;
  case 2:
    break;
  case 3:
    if (*(ushort *)in_A1 == 0 && (short)unaff_D5 == 0) {
      cVar3 = *(char *)((int)unaff_A6 + 0x195);
    }
    else {
      cVar3 = *(char *)(unaff_A6 + 0x158);
    }
    if (((cVar3 != '\0') &&
        (((*(char *)((int)unaff_A5 + -0x75af) == '\0' ||
          ((*(char *)((int)unaff_A5 + 0x2e3) != '\0' &&
           ((*(byte *)((int)unaff_A5 + 0x93) & 0x80) != 0)))) ||
         (*(char *)(unaff_A6 + 0x15a) == '0')))) &&
       ((unaff_A6[0x15] == unaff_A6[0x16] && (*(char *)((int)unaff_A6 + 0x49) == '\0')))) {
      return uVar5;
    }
    return uVar5;
  default:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 5:
  case 0x15:
  case 0x37:
  case 0x47:
  case 0x57:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 6:
  case 0xc:
    goto switchD_00003182_caseD_6;
  case 7:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 8:
  case 0x18:
  case 0x3a:
  case 0x4a:
  case 0x5a:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 9:
  case 0x19:
  case 0x3b:
  case 0x4b:
  case 0x5b:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 10:
  case 0x1a:
  case 0x3c:
  case 0x4c:
  case 0x5c:
    puVar16 = (ushort *)((int)in_A1 + (int)*(short *)((int)in_A1 + (int)(short)uVar7));
    in_A1 = (uint *)(puVar16 + 1);
    in_A0 = (uint *)(&DAT_00708fb0 + *puVar16);
    do {
      unaff_D2 = (uint)unaff_A5[0x161] << 0x10;
      puVar20 = (uint *)((int)in_A1 + 3);
LAB_00006cf0:
      in_A1 = (uint *)((int)puVar20 + 1);
      bVar14 = *(byte *)puVar20;
      if (bVar14 == 0) {
LAB_00006bf2:
        unaff_A5[-0x3ace] = 0;
        uVar5 = FUN_00002ae8();
        return uVar5;
      }
    } while (bVar14 == 0x2f);
code_r0x00006cfe:
    puVar20 = in_A1;
    if (bVar14 != 0x20) {
      *in_A0 = unaff_D2;
      uVar6 = (ushort)unaff_D2;
      *(ushort *)(in_A0 + 1) = uVar6;
      *(ushort *)((int)in_A0 + 6) = uVar6;
      in_A0[0x81c14] = unaff_D2;
      *(ushort *)(in_A0 + 0x81c15) = uVar6;
      *(ushort *)((int)in_A0 + 0x207056) = uVar6;
      in_A0 = in_A0 + 2;
    }
    goto LAB_00006cf0;
  case 0xb:
  case 0x1b:
  case 0x3d:
  case 0x4d:
  case 0x5d:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0xd:
    if (bVar23) {
      return (uint)(unaff_A5[0x43] & ~unaff_A5[0x44]);
    }
    return (uint)(unaff_A5[0x45] & ~unaff_A5[0x46]);
  case 0xe:
  case 0x1e:
  case 0x40:
  case 0x50:
  case 0x60:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0xf:
  case 0x1f:
  case 0x41:
  case 0x51:
  case 0x61:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x10:
    goto switchD_00003182_caseD_10;
  case 0x11:
    _DAT_00900802 = 0xf765;
    uVar5 = FUN_00007708();
    return uVar5;
  case 0x12:
  case 0x22:
  case 0x44:
  case 0x54:
  case 100:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x13:
  case 0x45:
  case 0x55:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x16:
  case 0x1c:
  case 0x38:
  case 0x3e:
    register0x0000003c = (BADSPACEBASE *)&uStack_4;
    uStack_4 = uStack_4 & 0x6710302b;
code_r0x00004700:
    uVar6 = (ushort)uVar5;
    *(uint *)(unaff_A2 + 0x3301) = *(uint *)(unaff_A2 + 0x3301) & 0x4a2b0012;
    goto code_r0x00004708;
  case 0x17:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x1d:
    do {
      uStack_4 = 0x9dde;
      FUN_00009ee6();
      uStack_4 = 0x9de2;
      FUN_00001950();
      uStack_4 = 0x9de6;
      FUN_00009eaa();
      *(char *)((int)unaff_A5 + 0x1d) = *(char *)((int)unaff_A5 + 0x1d) + '\x01';
      *(undefined1 *)(unaff_A5 + 0x177) = 0xff;
      uStack_4 = 0x9dbc;
      func_0x00009e00();
      uStack_4 = 0x9dc0;
      FUN_00002e96();
      if (*(char *)((int)unaff_A5 + 0x349) != '\0') {
        uStack_4 = 0x9dca;
        FUN_00002a28();
      }
      uStack_4 = 0x9dd6;
      (*(code *)(*(short *)((short)*unaff_A5 + 0x9de8) + 0x9de8))();
      uStack_4 = 0x9dda;
      FUN_00000d24();
    } while( true );
  case 0x20:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x21:
    bcdAdjust((char)unaff_D2 + bVar14 + in_XF);
    uStack_4 = 0x78d8;
    FUN_000078fe();
    sVar10 = 9;
    do {
      uStack_4 = 0x78f4;
      uVar5 = FUN_00007938();
      sVar10 = sVar10 + -1;
    } while (sVar10 != -1);
    return uVar5;
  case 0x23:
  case 0x65:
    *(uint *)unaff_A5 = *(int *)unaff_A5 - unaff_D5;
    uStack_4 = 0xa69c;
    FUN_0000a728();
    uStack_4 = 0xa6a2;
    FUN_000009d0();
    uStack_4 = 0xa6a8;
    FUN_000ccafc();
    uStack_4 = 0xa6ae;
    FUN_000ccb6c();
    uStack_4 = 0xa6b4;
    FUN_000ccbdc();
    uStack_4 = 0xa6ba;
    FUN_000ccc5c();
    uStack_4 = 0xa6c0;
    FUN_000ccc88();
    uStack_4 = 0xa6c6;
    FUN_000cccf2();
code_r0x0000a6c6:
    uStack_4 = 0xa6cc;
    FUN_000ccff8();
    uStack_4 = 0xa6d2;
    FUN_000c84ac();
    uStack_4 = 0xa6dc;
    FUN_000cd182();
    *(undefined1 *)(unaff_A5 + 0x767) = 1;
code_r0x0000a6e6:
    uStack_4 = 0xa6ec;
    FUN_000cd282();
    unaff_A5[0x1b] = 0x100;
    uStack_4 = 0xa6fc;
    FUN_000cd318();
    uStack_4 = 0xa702;
    FUN_000009d0();
    unaff_A5[3] = 2;
    uStack_4 = 0xa71c;
    FUN_00002ca6();
    uVar5 = FUN_00002ca6();
    return uVar5;
  case 0x24:
  case 0x66:
  case 0x27:
  case 0x69:
switchD_00003182_caseD_27:
    *(undefined1 *)(unaff_A5 + 0x506) = 0;
    if (*(char *)(unaff_A5 + 0x2d7) == '\0') {
      return uVar5;
    }
    *(undefined1 *)(unaff_A5 + 0x306) = 0;
    *(undefined1 *)(unaff_A5 + 0x506) = 1;
    return uVar5;
  case 0x25:
  case 0x67:
    puVar20 = in_A1 + 0xe;
    if (*(char *)(unaff_A5 + 999) != '\0') {
      in_A0 = in_A0 + -0xe;
      sVar10 = 6;
      do {
        puVar20 = in_A0 + 1;
        *in_A0 = uVar12;
        in_A0 = in_A0 + 2;
        *puVar20 = uVar12;
        puVar20 = in_A1 + 1;
        *in_A1 = uVar12;
        in_A1 = in_A1 + 2;
        *puVar20 = uVar12;
        sVar10 = sVar10 + -1;
        puVar20 = in_A1;
      } while (sVar10 != -1);
    }
LAB_00005fae:
    puVar17 = in_A0 + 0xe;
    puVar19 = puVar20 + 0xe;
    if (*(char *)(unaff_A5 + 0x5e7) != '\0') {
      sVar10 = 6;
      puVar17 = in_A0;
      puVar19 = puVar20;
      do {
        puVar20 = puVar17 + 1;
        *puVar17 = uVar12;
        puVar17 = puVar17 + 2;
        *puVar20 = uVar12;
        puVar20 = puVar19 + 1;
        *puVar19 = uVar12;
        puVar19 = puVar19 + 2;
        *puVar20 = uVar12;
        sVar10 = sVar10 + -1;
      } while (sVar10 != -1);
    }
    sVar10 = 0xb9;
    do {
      puVar20 = puVar17 + 1;
      *puVar17 = uVar12;
      puVar17 = puVar17 + 2;
      *puVar20 = uVar12;
      puVar20 = puVar19 + 1;
      *puVar19 = uVar12;
      puVar19 = puVar19 + 2;
      *puVar20 = uVar12;
      sVar10 = sVar10 + -1;
    } while (sVar10 != -1);
    puVar20 = (uint *)&DAT_00708000;
    sVar10 = 0x1f5;
    do {
      puVar17 = puVar20 + 1;
      *puVar20 = uVar12;
      puVar20 = puVar20 + 2;
      *puVar17 = uVar12;
      sVar10 = sVar10 + -1;
    } while (sVar10 != -1);
    _DAT_007095f2 = 0x8000;
    *(undefined1 *)(unaff_A5 + 0x163) = 1;
    uVar5 = FUN_00002ae8();
    return uVar5;
  case 0x26:
  case 0x68:
  case 0x72:
    *(char *)((int)unaff_A2 + 0x4e75) = (char)unaff_D6w;
    break;
  case 0x28:
  case 0x6a:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x29:
  case 0x6b:
    do {
      unaff_D2 = CONCAT22((short)(unaff_D2 >> 0x10),
                          (short)CONCAT31((int3)(unaff_D2 >> 8),*(undefined1 *)in_A1) * 2);
      uVar12 = CONCAT31((int3)(uVar12 >> 8),*(undefined1 *)((int)in_A1 + 1));
      puVar17 = (uint *)((int)in_A1 + 2);
      while( true ) {
        puVar20 = (uint *)((int)puVar17 + 1);
        bVar14 = *(byte *)puVar17;
        if (bVar14 == 0) goto LAB_00006bf2;
        if (bVar14 == 0x2f) break;
        if (bVar14 != 0x20) {
          uVar8 = bVar14 + 0x8000;
          *in_A0 = unaff_D2;
          *(ushort *)(in_A0 + 1) = uVar8;
          *(ushort *)((int)in_A0 + 6) = (ushort)uVar12;
          in_A0 = in_A0 + 0x81c14;
code_r0x00006cb6:
          *in_A0 = unaff_D2;
          *(ushort *)(in_A0 + 1) = uVar8;
          *(ushort *)((int)in_A0 + 6) = (ushort)uVar12;
          in_A0 = in_A0 + -0x81c12;
        }
        unaff_D2 = unaff_D2 + 0x80000;
        puVar17 = puVar20;
      }
      uVar12 = 0;
      in_A1 = (uint *)((int)puVar17 + 2);
      uVar6 = (ushort)*(byte *)puVar20 * 8 + 0x40;
      uVar7 = unaff_A5[0x161] | uVar6;
      if (unaff_A5[-0x3ace] != 0) {
        uVar7 = unaff_A5[-0x3ace] | unaff_A5[0x161] & 0x1fff | uVar6;
      }
      unaff_D2 = (uint)uVar7 << 0x10;
    } while( true );
  case 0x2a:
  case 0x30:
  case 0x6c:
    *(undefined1 *)(unaff_A2 + 0x1da4) = *(undefined1 *)(unaff_A2 + 0x1887);
    *(undefined1 *)(unaff_A2 + 0xaa3) = *(undefined1 *)((int)unaff_A2 + 0x522d);
    return uVar5;
  case 0x2b:
  case 0x6d:
    unaff_A5[0x3090] = (ushort)in_A0 + 2;
    *(char *)(unaff_A5 + 0x308f) = *(char *)(unaff_A5 + 0x308f) + -1;
    return 1;
  case 0x2c:
  case 0x6e:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x2d:
  case 0x6f:
    do {
      puVar20 = in_A0 + 1;
      *in_A0 = uVar12;
      in_A0 = in_A0 + 2;
      *puVar20 = uVar12;
      uVar6 = (short)uVar5 - 1;
      uVar5 = (uint)uVar6;
    } while (uVar6 != 0xffff);
    return 0xffff;
  case 0x2e:
  case 0x70:
    if (uVar7 < 0x31) {
      return uVar5;
    }
    *(undefined1 *)(unaff_A5 + 0x306) = 1;
    *(undefined1 *)(unaff_A5 + 0x506) = 0;
    if ((char)unaff_D2 == '\0') {
      return uVar5;
    }
    *(undefined1 *)(unaff_A5 + 0x306) = 0;
    *(undefined1 *)(unaff_A5 + 0x506) = 1;
    return uVar5;
  case 0x2f:
  case 0x71:
    in_A1 = (uint *)((int)in_A1 + -1);
    *(undefined1 *)in_A1 = *(undefined1 *)unaff_A3;
    *(undefined1 *)((int)unaff_A2 + -1) = *(undefined1 *)unaff_A5;
    *(undefined1 *)(unaff_A2 + -1) = *(undefined1 *)unaff_A5;
    *(undefined1 *)((int)unaff_A2 + -3) = *(undefined1 *)unaff_A5;
    *(undefined1 *)(unaff_A2 + -2) = *(undefined1 *)unaff_A5;
    *(undefined1 *)((int)unaff_A2 + -5) = *(undefined1 *)unaff_A5;
    *(undefined1 *)(unaff_A2 + -3) = *(undefined1 *)unaff_A5;
    *(undefined1 *)((int)unaff_A3 + -1) = in_stack_00000000;
    *(undefined1 *)(unaff_A3 + -1) = in_stack_00000000;
    *(undefined1 *)((int)unaff_A3 + -3) = in_stack_00000000;
    *(undefined1 *)(unaff_A3 + -2) = in_stack_00000000;
    unaff_A3 = (ushort *)((int)unaff_A3 + -5);
    *(undefined1 *)unaff_A3 = in_stack_00000000;
code_r0x000033b6:
    *(undefined1 *)((int)unaff_A3 + -1) = in_stack_00000000;
    *(undefined1 *)((int)unaff_A4 + -1) = *(undefined1 *)in_A1;
    *(undefined1 *)(unaff_A4 + -1) = *(undefined1 *)((int)in_A1 + 1);
    *(undefined1 *)((int)unaff_A4 + -3) = *(undefined1 *)((int)in_A1 + 2);
    *(char *)(unaff_A4 + -2) = (char)*in_A1;
    *(undefined1 *)((int)unaff_A4 + -5) = *(undefined1 *)(in_A1 + 1);
    *(undefined1 *)(unaff_A4 + -3) = *(undefined1 *)((int)in_A1 + 5);
    *(undefined1 *)((int)unaff_A5 + -1) = *(undefined1 *)((int)unaff_A3 + -1);
    *(undefined1 *)(unaff_A5 + -1) = *(undefined1 *)unaff_A3;
    *(char *)((int)unaff_A5 + -3) = (char)*unaff_A3;
    *(undefined1 *)(unaff_A5 + -2) = *(undefined1 *)(unaff_A3 + 1);
    *(undefined1 *)((int)unaff_A5 + -5) = *(undefined1 *)((int)unaff_A3 + 3);
    *(undefined1 *)(unaff_A5 + -3) = *(undefined1 *)(unaff_A3 + 2);
    *(undefined1 *)((int)unaff_A6 + -1) = *(undefined1 *)(unaff_A5 + -3);
    *(undefined1 *)(unaff_A6 + -1) = *(undefined1 *)((int)unaff_A5 + -5);
    *(undefined1 *)((int)unaff_A6 + -3) = *(undefined1 *)(unaff_A5 + -2);
    *(undefined1 *)(unaff_A6 + -2) = *(undefined1 *)((int)unaff_A5 + -3);
    *(undefined1 *)((int)unaff_A6 + -5) = *(undefined1 *)(unaff_A5 + -1);
    *(undefined1 *)(unaff_A6 + -3) = *(undefined1 *)((int)unaff_A5 + -1);
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x31:
    **(byte **)(unaff_A2 + (short)unaff_D5 + 0xaa6) = bVar14;
    return 1;
  case 0x32:
    *(undefined1 *)(unaff_A2 + 0x1da4) = *(undefined1 *)(unaff_A4 + 0x1887);
    *(undefined1 *)((int)unaff_A2 + 0x1547) = *(undefined1 *)((int)unaff_A4 + 0x522d);
    return uVar5;
  case 0x33:
    *(undefined1 *)((int)unaff_A3 + 0x422b) = 0;
    *(byte *)((int)unaff_A3 + 0x422d) = bVar14;
    *(undefined1 *)((int)unaff_A3 + 0x422b) = 0;
    *(byte *)((int)unaff_A3 + 0x422d) = bVar14;
    *(byte *)unaff_A5 = *(byte *)unaff_A5 & ~('\x01' << (bVar14 & 7));
    goto LAB_00004764;
  case 0x34:
    *(byte *)in_A0 = *(byte *)in_A0 | 0x3b;
  case 0x76:
    *(byte *)((int)unaff_A6 + -1) = *(byte *)((int)unaff_A6 + -1) | 0x6d;
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x35:
    return uVar5;
  case 0x39:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x3f:
    uVar6 = unaff_A5[3] - 1;
    unaff_A5[3] = uVar6;
    if (uVar6 == 0) {
      *unaff_A5 = *unaff_A5 + 2;
      unaff_A5[2] = 0;
      if (*(char *)((int)unaff_A5 + 0x349) != '\0') {
        *(undefined1 *)(unaff_A5 + -0x3235) = 1;
      }
    }
    return uVar5;
  case 0x42:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x43:
    uVar5 = FUN_00007b84();
    return uVar5;
  case 0x48:
  case 0x4e:
    goto switchD_00003182_caseD_48;
  case 0x49:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x4f:
    if ((unaff_A5[0x30b3] == 0) && (uVar6 = unaff_A5[3] - 1, unaff_A5[3] = uVar6, uVar6 == 0)) {
      unaff_A5[3] = 4;
      sVar10 = 0xf;
      puVar16 = (ushort *)&DAT_009001a0;
      do {
        puVar18 = puVar16;
        uVar6 = *puVar18;
        *puVar18 = uVar6 + 0x1000;
        if (0xefff < uVar6) {
          *puVar18 = *puVar18 - 0x1000;
        }
        sVar10 = sVar10 + -1;
        puVar16 = puVar18 + 1;
      } while (sVar10 != -1);
      uVar5 = 0xffff;
      if (0xefff < *puVar18) {
        unaff_A5[2] = unaff_A5[2] + 2;
        unaff_A5[3] = 0xf0;
        *(undefined1 *)(unaff_A5 + 0x6e9) = 1;
      }
    }
    return uVar5;
  case 0x52:
    goto switchD_00003182_caseD_52;
  case 0x53:
    uStack_4 = 0x7bdc;
    FUN_00007d24();
    uStack_4 = 0x7be0;
    FUN_00003288();
LAB_00007c02:
    uStack_4 = 0x7c06;
    FUN_00007a72();
    uVar5 = FUN_00007d3a();
    return uVar5;
  case 0x58:
  case 0x5e:
    goto switchD_00003182_caseD_58;
  case 0x59:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x5f:
    unaff_A6[5] = 0x500;
    uStack_4 = 0xa9e8;
    FUN_000cd318();
    unaff_A6[3] = 0x600;
    unaff_A6[5] = 0x600;
    uStack_4 = 0xa9fa;
    FUN_000cd318();
    unaff_A6[3] = 0x600;
    unaff_A6[5] = 0x700;
    uStack_4 = 0xaa0c;
    FUN_000cd318();
    while (((*(char *)((int)unaff_A5 + 0x345) != '\0' || ((unaff_A5[0x3f] & 0x4000) == 0)) &&
           ((*(char *)((int)unaff_A5 + 0x2e3) == '\0' || ((unaff_A5[0x49] & 0x8000) != 0))))) {
      uStack_4 = 0xaa34;
      (*(code *)(&DAT_0000aa60 + *(short *)(&DAT_0000aa60 + (short)*unaff_A5)))();
      uStack_4 = 0xaa3a;
      FUN_0002822a();
      uStack_4 = 0xaa40;
      FUN_000c8e1c();
      uStack_4 = 0xaa46;
      FUN_000c66ca();
      uStack_4 = 0xaa4a;
      FUN_00000d24();
      uStack_4 = 0xaa4e;
      FUN_0000aa66();
      uStack_4 = 0xaa52;
      FUN_00001950();
      uStack_4 = 0xaa5a;
      FUN_000009d0();
    }
    uVar5 = FUN_00002b1c();
    return uVar5;
  case 0x62:
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 99:
    uStack_4 = 0x7cee;
    FUN_00007a72();
    uVar5 = FUN_00007d3a();
    return uVar5;
  case 0x73:
    *(byte *)in_A0 = *(byte *)in_A0 | 0x40;
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  case 0x74:
    *(undefined1 *)((int)unaff_A2 + 0x4e75) = unaff_D7b;
    bVar14 = *(byte *)(unaff_A6 + 8);
    uVar5 = (uint)bVar14;
    uVar8 = (ushort)bVar14;
    uVar9 = (ushort)bVar14;
    uVar7 = *(ushort *)((int)&switchD_00003182::caseD_76 + (int)(short)uVar9);
    uVar12 = CONCAT22(uVar11,uVar7);
    puVar20 = in_A1;
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Could not find normalized switch variable to match jumptable */
    switch(bVar14) {
    case 0:
    case 0x3c:
      uVar6 = unaff_A5[0xaba];
      *(ushort *)((short)uVar6 + -2) = uVar22;
      unaff_A5[0xaba] = (ushort)(ushort *)((short)uVar6 + -2);
    case 0x38:
    case 0x42:
switchD_00003182_caseD_78:
      *(char *)((int)unaff_A5 + 0x1549) = *(char *)((int)unaff_A5 + 0x1549) + '\x01';
      return uVar5;
    case 1:
      *(byte *)(unaff_A6 + 0x23) = bVar14;
      uVar6 = unaff_A5[0xac0];
      *(ushort *)((short)uVar6 + -2) = uVar22;
      unaff_A5[0xac0] = (ushort)(ushort *)((short)uVar6 + -2);
      *(char *)(unaff_A5 + 0xaa6) = *(char *)(unaff_A5 + 0xaa6) + '\x01';
      return uVar5;
    case 2:
      uVar6 = unaff_A5[0xabb];
      *(ushort *)((short)uVar6 + -2) = uVar22;
      unaff_A5[0xabb] = (ushort)(ushort *)((short)uVar6 + -2);
    case 0x44:
switchD_00003182_caseD_7a:
      *(char *)(unaff_A5 + 0xaa5) = *(char *)(unaff_A5 + 0xaa5) + '\x01';
      return uVar5;
    case 3:
      goto LAB_00004764;
    case 4:
      uVar6 = unaff_A5[0xabc];
      *(ushort *)((short)uVar6 + -2) = uVar22;
      unaff_A5[0xabc] = (ushort)(ushort *)((short)uVar6 + -2);
    case 0x46:
switchD_00003182_caseD_7c:
      *(char *)((int)unaff_A5 + 0x154b) = *(char *)((int)unaff_A5 + 0x154b) + '\x01';
      return uVar5;
    case 5:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    default:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 7:
    case 0x17:
    case 0x27:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 8:
    case 0xe:
      goto code_r0x0000472a;
    case 9:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 10:
    case 0x1a:
    case 0x2a:
      uStack_4 = 0x62cc;
      FUN_00002ca6();
      do {
        uStack_4 = 0x62d4;
        FUN_000009d0();
      } while (*(int *)(unaff_A5 + 0x30ad) != -1);
      uStack_4 = 0x60a8;
      FUN_000060d0();
      uStack_4 = 0x60ba;
      FUN_000060d0();
      uStack_4 = 0x60cc;
      FUN_000060d0();
      __m68k_trap(9);
      puVar1 = *(undefined1 **)(unaff_A5 + -0x3efe);
      *(undefined4 *)(puVar1 + 0x10) = 0;
      *(undefined4 *)(puVar1 + 0x14) = 0;
      *(undefined4 *)(puVar1 + 0x18) = 0;
      *(undefined4 *)(puVar1 + 0x1c) = 0;
      *puVar1 = 0;
      iVar2 = *(int *)(unaff_A5 + -0x3efc);
      *(undefined4 *)(iVar2 + -4) = puVar1;
      *(undefined4 **)(unaff_A5 + -0x3efc) = (undefined4 *)(iVar2 + -4);
      unaff_A5[-0x3efa] = unaff_A5[-0x3efa] + 1;
      uVar5 = FUN_00000290();
      return uVar5;
    case 0xb:
    case 0x1b:
    case 0x2b:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0xc:
    case 0x1c:
    case 0x2c:
      goto code_r0x00006cfe;
    case 0xd:
    case 0x1d:
    case 0x2d:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0xf:
      bVar14 = *(byte *)((int)unaff_A3 + -1);
      bVar4 = '\x01' << (uVar7 & 7);
      *(byte *)((int)unaff_A3 + -1) = bVar14 ^ bVar4;
      if ((bVar14 & bVar4) == 0) {
                    /* WARNING: Could not recover jumptable at 0x0000cc80. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        uVar5 = (*(code *)(*(short *)((short)unaff_A5[2] + 0xcc84) + 0xcc84))();
        return uVar5;
      }
      *unaff_A5 = *unaff_A5 + 2;
      return uVar5;
    case 0x10:
    case 0x20:
    case 0x30:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x11:
    case 0x21:
    case 0x31:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x12:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x13:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x14:
    case 0x24:
    case 0x34:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x15:
    case 0x25:
      goto code_r0x0000a6e6;
    case 0x18:
    case 0x1e:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x19:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x1f:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x22:
      goto code_r0x00004700;
    case 0x23:
      goto LAB_00007c02;
    case 0x28:
    case 0x2e:
      goto code_r0x0000472e;
    case 0x29:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x2f:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x32:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x33:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x35:
      goto code_r0x0000a6c6;
    case 0x36:
      *(byte *)in_A0 = *(byte *)in_A0 | 0x41;
    case 0x39:
      uVar6 = (ushort)*(byte *)((int)unaff_A6 + 0x391);
      if (*(char *)((int)unaff_A6 + 0x3bd) != '\0') {
        uVar6 = 0x10;
      }
      uVar7 = 0;
      if (*(byte *)((int)in_A0 + 0x22) == 0) {
        uVar7 = *(ushort *)((int)in_A0 + 0x1c2);
      }
      if (*(byte *)((int)in_A0 + 0x12) == 0) {
        uVar7 = -uVar7;
      }
      uVar7 = unaff_A6[3] - (*(ushort *)((int)in_A0 + 6) + uVar7);
      bVar23 = -1 < (int)((uint)uVar7 << 0x10);
      if (!bVar23) {
        uVar7 = -uVar7;
      }
      if ((uVar7 <= *(ushort *)
                     (*(int *)(&DAT_0024eb2c + (short)(uVar6 << 2)) +
                     (int)(short)((unaff_D6w & 0xff) * 2))) &&
         (bVar23 == (bool)*(byte *)((int)in_A0 + 0x12))) {
        return 1;
      }
      return 0;
    case 0x37:
      goto LAB_00005fae;
    case 0x3a:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x3b:
      goto code_r0x00006cb6;
    case 0x3d:
      *(ushort *)((int)in_A0 + -2) = uVar22;
      unaff_A5[0x3090] = (ushort)(ushort *)((int)in_A0 + -2);
      *(char *)(unaff_A5 + 0x308f) = *(char *)(unaff_A5 + 0x308f) + '\x01';
      return uVar5;
    case 0x3e:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x3f:
      *(byte *)((int)unaff_A2 + -1) = *(byte *)((int)unaff_A2 + -1) | '\x01' << (unaff_D3 & 7);
      unaff_A5[0x5f1] = unaff_A5[0x5f0];
      if (*(char *)(unaff_A5 + 0x173) == '\0') {
        unaff_A5[0x3f0] = unaff_A5[0x43];
        unaff_A5[0x5f0] = unaff_A5[0x45];
        if (((*(char *)((int)unaff_A5 + 0x2e3) != '\0') && ((unaff_A5[0x49] & 0x100) == 0)) &&
           ((*(byte *)((int)unaff_A5 + 0x93) & 2) != 0)) {
          unaff_A5[0x3f1] = unaff_A5[0x3f1] & 0xf;
          unaff_A5[0x5f1] = unaff_A5[0x5f1] & 0xf;
        }
        return uVar5;
      }
      if ((unaff_A5[0x49] & 0x4000) != 0) {
        uStack_4 = 0x2d64;
        func_0x00002d68();
        uVar6 = unaff_A5[0x45];
        unaff_A5[0x5f0] = uVar6;
        puVar16 = *(ushort **)(unaff_A5 + 0x4f);
        if (puVar16 < *(ushort **)(unaff_A5 + 0x31a9)) {
          if (uVar6 == *puVar16) {
            uVar7 = puVar16[1] + 1;
            puVar16[1] = uVar7;
            if (uVar7 != 0) {
              return (uint)uVar6;
            }
            puVar16[1] = puVar16[1] - 1;
          }
          *(ushort **)(unaff_A5 + 0x4f) = puVar16 + 2;
          puVar16[2] = uVar6;
          puVar16[3] = 1;
        }
        return (uint)uVar6;
      }
      uStack_4 = 0x2d10;
      uVar5 = func_0x00002d14();
      uVar6 = unaff_A5[0x52] - 1;
      unaff_A5[0x52] = uVar6;
      if (uVar6 == 0) {
        puVar16 = *(ushort **)(unaff_A5 + 0x4f);
        uVar5 = (uint)puVar16[1];
        if (puVar16[1] == 0) {
          puVar16 = puVar16 + 2;
        }
        unaff_A5[0x5f0] = *puVar16;
        unaff_A5[0x52] = puVar16[1];
        *(ushort **)(unaff_A5 + 0x4f) = puVar16 + 2;
      }
      return uVar5;
    case 0x40:
      goto switchD_00003182_caseD_27;
    case 0x41:
      goto code_r0x000033b6;
    case 0x43:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x45:
      *(byte *)in_A1 = *(byte *)in_A1 & ~('\x01' << (uVar7 & 7));
      sVar10 = (ushort)(bVar14 | 0x2e) * 2;
      pbVar21 = (byte *)((int)in_A0 +
                        (int)(short)(CONCAT11((char)((ushort)sVar10 >> 8),
                                              *(undefined1 *)(*(int *)(unaff_A4 + 0xd) + 0x10)) << 3
                                    ) + (int)*(short *)((int)in_A0 + (int)sVar10));
      sVar10 = *(short *)pbVar21;
      if (*(char *)(unaff_A4 + 9) != '\0') {
        sVar10 = -sVar10;
      }
      unaff_A6[3] = unaff_A4[3] + sVar10;
      unaff_A6[5] = unaff_A4[5] + *(short *)(pbVar21 + 2);
      sVar10 = *(short *)(pbVar21 + 4);
      *(byte *)((int)unaff_A5 + 0x2f5) = *(byte *)((int)unaff_A6 + 0x381) ^ (byte)sVar10 & 1 ^ 1;
      *(byte *)(unaff_A6 + 9) = *(byte *)(unaff_A4 + 9) ^ ((byte)sVar10 & 0x20) >> 5;
      uVar5 = FUN_0000524e();
      return uVar5;
    case 0x47:
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    case 0x48:
      goto switchD_00003182_caseD_7e;
    case 0x49:
      goto LAB_0000719a;
    case 0x4a:
      goto switchD_00003182_caseD_80;
    case 0x4b:
      *(ushort *)in_A1 = uVar9 | *(ushort *)in_A1;
      *unaff_A2 = uVar9 | *unaff_A2;
      *unaff_A3 = uVar9 | *unaff_A3;
      *unaff_A4 = uVar9 | *unaff_A4;
      *unaff_A5 = uVar9 | *unaff_A5;
      *unaff_A6 = uVar9 | *unaff_A6;
      uVar6 = (*unaff_A6 & 0xf0f) + 0x80bb;
      *(byte *)((int)in_A0 + -1) = (byte)((uVar6 & 0xf00) >> 4) | (byte)uVar6 & 0xf;
      uVar5 = uRam0000031c | uVar5;
      uVar6 = (ushort)uVar5;
      unaff_A5[1] = uVar6 | unaff_A5[1];
      *unaff_A6 = uVar6 | *unaff_A6;
      uVar5 = *(uint *)((int)unaff_A5 + -0x7f51) | uVar5 | 0x42;
      puVar20 = (uint *)((int)in_A0 + -2);
      *(byte *)puVar20 = *(byte *)puVar20 | 0x50;
      *puVar20 = unaff_D2;
      *(ushort *)((int)in_A0 + 2) = (ushort)uVar5;
      *(ushort *)(in_A0 + 1) = uVar7;
      return uVar5;
    case 0x4c:
      goto code_r0x00003216;
    case 0x4d:
      goto code_r0x000091b6;
    case 0x4e:
      return uVar5;
    case 0x4f:
      goto code_r0x0000a1b6;
    case 0x50:
      return uVar5;
    }
  case 0x75:
    *(int *)(unaff_A6 + 0x1c) = (short)uVar7 + 0x24e1f4;
    return uVar5;
  case 0x77:
    uVar5 = FUN_00000adc();
    return uVar5;
  case 0x78:
    goto switchD_00003182_caseD_78;
  case 0x79:
    in_A0 = (uint *)(&DAT_00708fb0 + uVar5);
    unaff_D6w = *(ushort *)in_A1 - 1;
    unaff_D2 = (uint)unaff_A5[0x161] << 0x10;
LAB_0000719a:
    do {
      *in_A0 = unaff_D2;
      uVar6 = (ushort)unaff_D2;
      *(ushort *)(in_A0 + 1) = uVar6;
      *(ushort *)((int)in_A0 + 6) = uVar6;
      in_A0[0x81c14] = unaff_D2;
      *(ushort *)(in_A0 + 0x81c15) = uVar6;
      *(ushort *)((int)in_A0 + 0x207056) = uVar6;
      in_A0 = in_A0 + 2;
      unaff_D6w = unaff_D6w - 1;
    } while (unaff_D6w != 0xffff);
    uVar5 = FUN_00002ae8();
    return uVar5;
  case 0x7a:
    goto switchD_00003182_caseD_7a;
  case 0x7b:
    *(byte *)in_A0 = *(byte *)in_A0 | '\x01' << (unaff_D4 & 7);
    while( true ) {
      puVar20 = (uint *)((int)in_A1 + 1);
      bVar14 = *(byte *)in_A1;
      if (bVar14 == 0) break;
      if (bVar14 == 0x2f) {
        *(undefined1 *)((int)unaff_A6 + 0x15) = 1;
        in_A1 = (uint *)((int)in_A1 + 6);
      }
      else {
        if (bVar14 < 0x20) {
          if ((1 << (bVar14 & 0x1f) & 0xeU) == 0) {
            uStack_4 = 0x81b2;
            FUN_000081d4();
            puVar20 = extraout_A1_02;
          }
          else {
            uStack_4 = 0x81a8;
            FUN_000081d4();
            puVar20 = extraout_A1_01;
          }
        }
        else if (bVar14 != 0x20) {
          uStack_4 = 0x8172;
          FUN_000081d4();
          puVar20 = extraout_A1;
        }
        in_A1 = puVar20;
        if (*(char *)(unaff_A6 + 0xb) != '\0') {
          uStack_4 = 0x8184;
          FUN_00002ae8();
          uStack_4 = 0x8188;
          FUN_000009d0();
          in_A1 = extraout_A1_00;
        }
      }
    }
    uStack_4 = 0x7f68;
    FUN_00002ae8();
    *(undefined1 *)(unaff_A5 + 0x176) = 0;
    uVar5 = FUN_00000adc();
    return uVar5;
  case 0x7c:
    goto switchD_00003182_caseD_7c;
  case 0x7d:
    *(byte *)(in_A0 + 0xc0f) = *(byte *)(in_A0 + 0xc0f) & ~('\x01' << (unaff_D4 & 7));
    *(ushort *)((int)in_A0 + -2) = *(ushort *)((int)in_A0 + -2) | 0x4eb8;
    *(byte *)((int)in_A0 + 0x303a) = *(byte *)((int)in_A0 + 0x303a) & ~('\x01' << (unaff_D4 & 7));
    *(uint *)((int)in_A0 + -6) = *(uint *)((int)in_A0 + -6) | 0x4eb809a8;
    uStack_4 = 0x91a0;
    FUN_000009a8();
    uStack_4 = 0x91a8;
    FUN_000009a8();
    uStack_4 = 0x91ac;
    FUN_00002c86();
    uStack_4 = 0x91b0;
    FUN_00000b2a();
    *unaff_A5 = 0;
code_r0x000091b6:
    uStack_4 = 0x91ba;
    FUN_000009d0();
    do {
      do {
        uStack_4 = 0x91c6;
        (*(code *)((int)&PTR_DAT_000091e6 +
                  (int)*(short *)((int)&PTR_DAT_000091e6 + (int)(short)*unaff_A5)))();
        uStack_4 = 0x91cc;
        FUN_000009d0();
      } while (*(char *)(unaff_A5 + 0x31c1) != '\0');
    } while ((*(char *)(unaff_A5 + 0x31c0) == '\x02') || ((unaff_A5[0x3f] & 0x4000) == 0));
    uVar5 = FUN_00002b1c();
    return uVar5;
  case 0x7e:
switchD_00003182_caseD_7e:
    uVar5 = unaff_D2 & 0xff;
    *(byte *)in_A0 = *(byte *)in_A0 | 0x20;
    pbVar21 = (byte *)((int)in_A0 + (short)uVar5 + 0x50);
    *pbVar21 = *pbVar21 | 0x40;
    in_A0 = (uint *)((int)in_A0 + -2);
    *(ushort *)in_A0 = *(ushort *)in_A0 | 0x70;
  case 0x80:
switchD_00003182_caseD_80:
    uVar5 = uVar5 | 0x306d1582;
    *(ushort *)((int)in_A0 + -2) = uVar22;
    unaff_A5[0xac1] = (ushort)(ushort *)((int)in_A0 + -2);
    *(char *)((int)unaff_A5 + 0x154d) = *(char *)((int)unaff_A5 + 0x154d) + '\x01';
code_r0x00003216:
    return uVar5;
  case 0x7f:
    if (bVar23) {
      bVar23 = false;
      uStack_4 = 0xa194;
      FUN_0000a1bc();
      uVar12 = extraout_D1;
      if (bVar23) {
        uStack_4 = 0xa1a0;
        uVar5 = FUN_0000a1bc();
        return uVar5;
      }
    }
    pbVar21 = (byte *)((int)unaff_A5 + 0x34b);
    if ((uVar12 & 0x20) != 0) goto code_r0x0000a1bc;
code_r0x0000a1b6:
    pbVar21 = (byte *)((int)unaff_A5 + 0x2e9);
code_r0x0000a1bc:
    if (*(char *)((int)unaff_A5 + 0x2df) == '\0') {
      bVar14 = bcdAdjust(*pbVar21 - (*(char *)(unaff_A5 + 0x170) + 1U));
      if (*pbVar21 < (byte)(*(char *)(unaff_A5 + 0x170) + 1U)) {
        return 1;
      }
      *pbVar21 = bVar14;
    }
    return 1;
  }
  uVar6 = unaff_A5[0xab6];
  *(ushort *)((short)uVar6 + -2) = uVar22;
  unaff_A5[0xab6] = (ushort)(ushort *)((short)uVar6 + -2);
  *(char *)((int)unaff_A5 + 0x1547) = *(char *)((int)unaff_A5 + 0x1547) + '\x01';
  return uVar5;
switchD_00003182_caseD_10:
  bVar23 = *(char *)(unaff_A2 + 5) == '\0';
switchD_00003182_caseD_52:
  if (((!bVar23) && (*(char *)((int)unaff_A3 + 0x1bf) == '\0')) &&
     (*(char *)((int)unaff_A3 + 0x1a1) == '\0')) {
    unaff_D5 = (uint)unaff_A6[0x32];
    if (*(char *)(unaff_A6 + 9) != '\0') {
      unaff_D5 = (uint)(ushort)-unaff_A6[0x32];
    }
switchD_00003182_caseD_6:
    unaff_D5 = (uint)(ushort)(unaff_A6[3] + (short)unaff_D5);
    uVar5 = (uint)unaff_A3[3];
    bVar23 = *(char *)((int)unaff_A3 + 0x2a7) == '\0';
switchD_00003182_caseD_48:
    sVar15 = (short)unaff_D5;
    sVar10 = (short)uVar5;
    if (!bVar23) {
switchD_00003182_caseD_58:
      sVar15 = (short)unaff_D5;
      uVar6 = unaff_A3[0x155];
      if (*(char *)(unaff_A3 + 9) == '\0') {
code_r0x00004708:
        sVar15 = (short)unaff_D5;
        uVar6 = -uVar6;
      }
      sVar10 = unaff_A3[3] + uVar6;
    }
    if ((ushort)(unaff_A3[0x36] + unaff_A6[0x34] + (sVar15 - sVar10)) <=
        (ushort)((unaff_A3[0x36] + unaff_A6[0x34]) * 2)) {
      unaff_D6w = unaff_A6[0x33] + unaff_A6[5];
code_r0x0000472a:
      uVar6 = unaff_A3[5];
code_r0x0000472e:
      if ((ushort)(unaff_A6[0x35] + (unaff_D6w - (unaff_A3[0x37] + uVar6))) <=
          (ushort)(unaff_A6[0x35] * 2)) {
        if (*(char *)(unaff_A5 + -0x3ad8) == '\0') {
          cVar3 = *(char *)(unaff_A5 + 0x6f7);
          *(undefined1 *)(unaff_A5 + 0x6f7) = 1;
          if (cVar3 == '\0') {
            *(undefined1 *)((int)unaff_A6 + 0x291) = 2;
            *(undefined1 *)(unaff_A6 + 0x149) = 0;
          }
LAB_00004764:
          *(undefined1 *)(unaff_A3 + 200) = 0;
          unaff_A3[0x29] = 0;
          *(undefined1 *)((int)unaff_A6 + 99) = 1;
          *(undefined1 *)((int)unaff_A3 + 99) = 0xff;
          *(undefined1 *)(unaff_A3 + 0x15e) = 0;
          *(undefined1 *)((int)unaff_A3 + 0x2bd) = 0;
          *(undefined1 *)((int)unaff_A6 + 0x18b) = 0;
          *(undefined1 *)((int)unaff_A3 + 0x18b) = 0;
          *(undefined1 *)((int)unaff_A3 + 0x195) = 0;
          *(undefined1 *)(unaff_A3 + 0x158) = 0;
          *(undefined1 *)((int)unaff_A3 + 0x2a7) = 0;
          unaff_A6[0xd8] = unaff_A6[0xd8] + 1;
          *(undefined1 *)(unaff_A3 + 0xa2) = *(undefined1 *)(unaff_A3 + 0x92);
          *(undefined1 *)((int)unaff_A3 + 0x1f1) = *(undefined1 *)(unaff_A3 + 0xf8);
          *(undefined1 *)(unaff_A3 + 0x92) = 0;
          *(undefined1 *)(unaff_A3 + 0xf8) = 0;
          *(undefined1 *)((int)unaff_A3 + 0x2b5) = 0;
          *(byte *)(unaff_A5 + 0x6ef) =
               *(byte *)(unaff_A5 + 0x6ef) | '\x01' << (*(byte *)((int)unaff_A6 + 0x381) & 7);
          *(uint **)(unaff_A5 + -0x3ae6) = in_A0;
          *(undefined4 *)((int)register0x0000003c + -4) = 0x47c4;
          FUN_00005b58();
          *(undefined4 *)((int)register0x0000003c + -4) = 0x47c8;
          FUN_00007adc();
        }
        return 1;
      }
    }
  }
  return 0;
}



/* 00003288 FUN_00003288 */

void FUN_00003288(void)

{
  return;
}



/* 00003440 FUN_00003440 */

void FUN_00003440(void)

{
  short sVar1;
  short sVar2;
  undefined2 *puVar3;
  undefined4 *puVar4;
  int unaff_A5;
  undefined4 *puVar5;
  
  FUN_0000362e();
  FUN_0000365a();
  FUN_00003616();
  FUN_00003648();
  FUN_00003678();
  FUN_0000366c();
  sVar1 = 0x1f;
  puVar5 = (undefined4 *)(unaff_A5 + 0x620e);
  do {
    *puVar5 = 0;
    sVar1 = sVar1 + -1;
    puVar5 = puVar5 + 1;
  } while (sVar1 != -1);
  puVar3 = (undefined2 *)(unaff_A5 + 0x1052);
  puVar5 = (undefined4 *)(&DAT_000015a2 + unaff_A5);
  (&DAT_00001542)[unaff_A5] = 2;
  sVar1 = 1;
  do {
    sVar2 = 0x3f;
    puVar4 = puVar5;
    do {
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
      puVar4 = puVar4 + 1;
    } while (sVar2 != -1);
    (&DAT_000015c3)[unaff_A5] = 0;
    (&DAT_000016c3)[unaff_A5] = 1;
    *(undefined1 *)((int)puVar5 + 0x22) = 2;
    puVar3 = puVar3 + -1;
    *puVar3 = (short)puVar5;
    puVar5 = puVar5 + 0x40;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  *(short *)(&DAT_00001562 + unaff_A5) = (short)puVar3;
  puVar3 = (undefined2 *)(unaff_A5 + 0x1082);
  puVar5 = (undefined4 *)(unaff_A5 + 0x1da2);
  (&DAT_00001548)[unaff_A5] = 0x10;
  sVar1 = 0xf;
  do {
    sVar2 = 0x2f;
    puVar4 = puVar5;
    do {
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
      puVar4 = puVar4 + 1;
    } while (sVar2 != -1);
    *(undefined1 *)((int)puVar5 + 0x22) = 6;
    puVar3 = puVar3 + -1;
    *puVar3 = (short)puVar5;
    puVar5 = puVar5 + 0x30;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  *(short *)(&DAT_00001572 + unaff_A5) = (short)puVar3;
  puVar3 = (undefined2 *)(unaff_A5 + 0x1062);
  puVar5 = (undefined4 *)(&DAT_000017a2 + unaff_A5);
  (&DAT_00001545)[unaff_A5] = 8;
  sVar1 = 7;
  do {
    sVar2 = 0x2f;
    puVar4 = puVar5;
    do {
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
      puVar4 = puVar4 + 1;
    } while (sVar2 != -1);
    *(undefined1 *)((int)puVar5 + 0x22) = 4;
    puVar3 = puVar3 + -1;
    *puVar3 = (short)puVar5;
    puVar5 = puVar5 + 0x30;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  *(short *)(&DAT_00001568 + unaff_A5) = (short)puVar3;
  puVar5 = (undefined4 *)(unaff_A5 + -0x5ef2);
  sVar1 = 1;
  do {
    sVar2 = 0x1f;
    puVar4 = puVar5;
    do {
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
      puVar4 = puVar4 + 1;
    } while (sVar2 != -1);
    *(undefined1 *)((int)puVar5 + 0x22) = 0xc;
    puVar5 = puVar5 + 0x20;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  puVar3 = (undefined2 *)(unaff_A5 + 0x10fa);
  puVar5 = (undefined4 *)(unaff_A5 + 0x29a2);
  (&DAT_0000154c)[unaff_A5] = 0x3c;
  sVar1 = 0x3b;
  do {
    sVar2 = 0x2f;
    puVar4 = puVar5;
    do {
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
      puVar4 = puVar4 + 1;
    } while (sVar2 != -1);
    *(undefined1 *)((int)puVar5 + 0x22) = 8;
    puVar3 = puVar3 + -1;
    *puVar3 = (short)puVar5;
    puVar5 = puVar5 + 0x30;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  *(short *)(&DAT_00001580 + unaff_A5) = (short)puVar3;
  (&DAT_00001543)[unaff_A5] = 0;
  (&DAT_00001544)[unaff_A5] = 0;
  *(undefined2 *)(&DAT_00001564 + unaff_A5) = 0x90fe;
  *(undefined2 *)(&DAT_00001566 + unaff_A5) = 0x9102;
  (&DAT_00001546)[unaff_A5] = 0;
  (&DAT_00001547)[unaff_A5] = 0;
  *(undefined2 *)(&DAT_0000156a + unaff_A5) = 0x9112;
  *(undefined2 *)(&DAT_0000156c + unaff_A5) = 0x9122;
  (&DAT_00001549)[unaff_A5] = 0;
  (&DAT_0000154a)[unaff_A5] = 0;
  (&DAT_0000154b)[unaff_A5] = 0;
  *(undefined2 *)(&DAT_00001574 + unaff_A5) = 0x9142;
  *(undefined2 *)(&DAT_00001576 + unaff_A5) = 0x9162;
  *(undefined2 *)(&DAT_00001578 + unaff_A5) = 0x9182;
  (&DAT_0000154d)[unaff_A5] = 0;
  (&DAT_0000154e)[unaff_A5] = 0;
  (&DAT_0000154f)[unaff_A5] = 0;
  (&DAT_00001550)[unaff_A5] = 0;
  (&DAT_00001551)[unaff_A5] = 0;
  (&DAT_00001552)[unaff_A5] = 0;
  (&DAT_00001553)[unaff_A5] = 0;
  (&DAT_00001554)[unaff_A5] = 0;
  *(undefined2 *)(&DAT_00001582 + unaff_A5) = 0x91fa;
  *(undefined2 *)(&DAT_00001584 + unaff_A5) = 0x9272;
  *(undefined2 *)(&DAT_00001586 + unaff_A5) = 0x92ea;
  *(undefined2 *)(&DAT_00001588 + unaff_A5) = 0x9362;
  *(undefined2 *)(&DAT_0000158a + unaff_A5) = 0x93da;
  *(undefined2 *)(&DAT_0000158c + unaff_A5) = 0x9452;
  *(undefined2 *)(&DAT_0000158e + unaff_A5) = 0x94ca;
  *(undefined2 *)(&DAT_00001590 + unaff_A5) = 0x9542;
  return;
}



/* 00003616 FUN_00003616 */

void FUN_00003616(void)

{
  short sVar1;
  undefined4 *puVar2;
  int unaff_A5;
  undefined4 *puVar3;
  
  sVar1 = 0xdf;
  puVar2 = (undefined4 *)(unaff_A5 + 0x84e);
  puVar3 = (undefined4 *)(unaff_A5 + 0x44e);
  do {
    *puVar3 = 0;
    *puVar2 = 0;
    sVar1 = sVar1 + -1;
    puVar2 = puVar2 + 1;
    puVar3 = puVar3 + 1;
  } while (sVar1 != -1);
  return;
}



/* 0000362e FUN_0000362e */

void FUN_0000362e(void)

{
  short sVar1;
  int unaff_A5;
  undefined4 *puVar2;
  
  DAT_00804152 = 0x106;
  sVar1 = 0x5f;
  puVar2 = (undefined4 *)(unaff_A5 + 0xe4e);
  do {
    *puVar2 = 0;
    sVar1 = sVar1 + -1;
    puVar2 = puVar2 + 1;
  } while (sVar1 != -1);
  return;
}



/* 00003648 FUN_00003648 */

void FUN_00003648(void)

{
  short sVar1;
  int unaff_A5;
  undefined4 *puVar2;
  
  sVar1 = 0x1f;
  puVar2 = (undefined4 *)(unaff_A5 + 0xfce);
  do {
    *puVar2 = 0;
    sVar1 = sVar1 + -1;
    puVar2 = puVar2 + 1;
  } while (sVar1 != -1);
  return;
}



/* 0000365a FUN_0000365a */

void FUN_0000365a(void)

{
  short sVar1;
  int unaff_A5;
  undefined4 *puVar2;
  
  sVar1 = 0xf;
  puVar2 = (undefined4 *)(&DAT_000061ce + unaff_A5);
  do {
    *puVar2 = 0;
    sVar1 = sVar1 + -1;
    puVar2 = puVar2 + 1;
  } while (sVar1 != -1);
  return;
}



/* 0000366c FUN_0000366c */

void FUN_0000366c(void)

{
  int unaff_A5;
  
  *(undefined4 *)(&DAT_000061ca + unaff_A5) = 0;
  return;
}



/* 00003678 FUN_00003678 */

void FUN_00003678(void)

{
  short sVar1;
  short sVar2;
  undefined2 *puVar3;
  undefined4 *puVar4;
  int unaff_A5;
  undefined4 *puVar5;
  
  puVar3 = (undefined2 *)(&DAT_0000614a + unaff_A5);
  puVar5 = (undefined4 *)(&DAT_0000571e + unaff_A5);
  (&DAT_0000611e)[unaff_A5] = 0x14;
  sVar1 = 0x13;
  do {
    sVar2 = 0x1f;
    puVar4 = puVar5;
    do {
      *puVar4 = 0;
      sVar2 = sVar2 + -1;
      puVar4 = puVar4 + 1;
    } while (sVar2 != -1);
    *(undefined1 *)((int)puVar5 + 0x22) = 10;
    puVar3 = puVar3 + -1;
    *puVar3 = (short)puVar5;
    puVar5 = puVar5 + 0x20;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  *(short *)(&DAT_00006120 + unaff_A5) = (short)puVar3;
  return;
}



/* 00003778 FUN_00003778 */

undefined4 FUN_00003778(void)

{
  int unaff_A5;
  
  if ((&DAT_0000154c)[unaff_A5] != '\0') {
    *(short *)(&DAT_00001580 + unaff_A5) = *(short *)(&DAT_00001580 + unaff_A5) + 2;
    (&DAT_0000154c)[unaff_A5] = (&DAT_0000154c)[unaff_A5] + -1;
    return 1;
  }
  return 0;
}



/* 00004018 FUN_00004018 */

undefined4 FUN_00004018(void)

{
  int unaff_A5;
  
  if (((*(char *)(unaff_A5 + 0x7dc) != '\0') || (*(char *)(unaff_A5 + 0x80b) == '\0')) &&
     ((*(char *)(unaff_A5 + 0xbdc) != '\0' || (*(char *)(unaff_A5 + 0xc0b) == '\0')))) {
    return 1;
  }
  return 0;
}



/* 00004038 FUN_00004038 */

undefined4 FUN_00004038(void)

{
  int unaff_A5;
  int unaff_A6;
  
  if ((*(char *)(unaff_A6 + 0x3b6) == '\0') &&
     ((*(char *)(unaff_A5 + 0x349) == '\0' || (*(char *)(unaff_A5 + 0x363) != '\0')))) {
    return 0;
  }
  return 1;
}



/* 00004052 FUN_00004052 */

void FUN_00004052(void)

{
  char in_D0b;
  int unaff_A6;
  
  *(char *)(unaff_A6 + 0x2b4) = in_D0b + *(char *)(unaff_A6 + 0x2b4);
  if (0x30 < *(byte *)(unaff_A6 + 0x2b4)) {
    *(undefined1 *)(unaff_A6 + 0x2b4) = 0x30;
  }
  return;
}



/* 00004176 FUN_00004176 */

void FUN_00004176(void)

{
  short sVar1;
  int unaff_A5;
  
  sVar1 = *(short *)(unaff_A5 + 0x854) - *(short *)(unaff_A5 + 0x454);
  if (0x30 < (ushort)(sVar1 + 0x18U)) {
    *(undefined1 *)(unaff_A5 + 0x60c) = 1;
    *(undefined1 *)(unaff_A5 + 0xa0c) = 0;
    if (sVar1 < 0) {
      *(undefined1 *)(unaff_A5 + 0x60c) = 0;
      *(undefined1 *)(unaff_A5 + 0xa0c) = 1;
    }
  }
  return;
}



/* 00004334 FUN_00004334 */

undefined4 FUN_00004334(void)

{
  int unaff_A5;
  int unaff_A6;
  
  if (*(short *)(unaff_A6 + 10) < *(short *)(unaff_A5 + 0xc5c)) {
    *(undefined2 *)(unaff_A6 + 10) = *(undefined2 *)(unaff_A5 + 0xc5c);
    return 1;
  }
  return 0;
}



/* 000044d0 FUN_000044d0 */

ushort FUN_000044d0(void)

{
  ushort in_D1w;
  int unaff_A6;
  
  return in_D1w & *(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394);
}



/* 000044de FUN_000044de */

ushort FUN_000044de(void)

{
  ushort in_D1w;
  int unaff_A6;
  
  return in_D1w & *(ushort *)(unaff_A6 + 0x394) & ~*(ushort *)(unaff_A6 + 0x392);
}



/* 0000452a FUN_0000452a */

void FUN_0000452a(void)

{
  char cVar1;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A5 + -0x75af) = 1;
  if (*(char *)(unaff_A6 + 0x38e) == '\0') {
    return;
  }
  if (*(char *)(unaff_A6 + 0x181) == '\0') {
    if (*(char *)(unaff_A5 + 0x2f3) != '\0') {
      return;
    }
    if (*(char *)(unaff_A5 + 0xdd2) != '\0') {
      return;
    }
    if (*(char *)(unaff_A5 + 0xdde) != '\0') {
      return;
    }
    if (*(char *)(unaff_A6 + 3) == '\f') {
      return;
    }
    if ((*(char *)(unaff_A6 + 3) != '\x0e') && (*(char *)(unaff_A6 + 3) != '\x14')) {
      if ((*(char *)(unaff_A6 + 0x38e) != '\0') &&
         ((*(char *)(unaff_A6 + 3) == '\n' ||
          ((*(char *)(unaff_A6 + 3) == '\x04' && (*(char *)(unaff_A6 + 4) == '\x06')))))) {
        if (*(char *)(unaff_A5 + -0x75af) == '\0') {
          cVar1 = *(char *)(unaff_A6 + 0x195);
        }
        else {
          cVar1 = *(char *)(unaff_A6 + 0x2b0);
        }
        if (cVar1 == '\0') {
          return;
        }
      }
      if ((*(char *)(unaff_A5 + -0x75af) != '\0') &&
         (((*(char *)(unaff_A5 + 0x2e3) == '\0' || ((*(byte *)(unaff_A5 + 0x93) & 0x80) == 0)) &&
          (*(char *)(unaff_A6 + 0x2b4) != '0')))) {
        return;
      }
      if (*(short *)(unaff_A6 + 0x2a) != *(short *)(unaff_A6 + 0x2c)) {
        return;
      }
      if (*(char *)(unaff_A6 + 0x49) != '\0') {
        return;
      }
      return;
    }
  }
  else if (*(char *)(unaff_A6 + 3) != '\x0e') {
    return;
  }
  *(undefined1 *)(unaff_A6 + 0x169) = 1;
  return;
}



/* 00004532 FUN_00004532 */

void FUN_00004532(void)

{
  char cVar1;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A5 + -0x75af) = 0;
  if ((((*(char *)(unaff_A6 + 0x38e) != '\0') && (*(char *)(unaff_A5 + 0x2f3) == '\0')) &&
      (*(char *)(unaff_A5 + 0xdd2) == '\0')) &&
     ((*(char *)(unaff_A5 + 0xdde) == '\0' && (*(char *)(unaff_A6 + 3) != '\f')))) {
    if ((*(char *)(unaff_A6 + 3) == '\x0e') || (*(char *)(unaff_A6 + 3) == '\x14')) {
      *(undefined1 *)(unaff_A6 + 0x169) = 1;
    }
    else {
      if ((*(char *)(unaff_A6 + 0x38e) != '\0') &&
         ((*(char *)(unaff_A6 + 3) == '\n' ||
          ((*(char *)(unaff_A6 + 3) == '\x04' && (*(char *)(unaff_A6 + 4) == '\x06')))))) {
        if (*(char *)(unaff_A5 + -0x75af) == '\0') {
          cVar1 = *(char *)(unaff_A6 + 0x195);
        }
        else {
          cVar1 = *(char *)(unaff_A6 + 0x2b0);
        }
        if (cVar1 == '\0') {
          return;
        }
      }
      if (((*(char *)(unaff_A5 + -0x75af) == '\0') ||
          (((*(char *)(unaff_A5 + 0x2e3) != '\0' && ((*(byte *)(unaff_A5 + 0x93) & 0x80) != 0)) ||
           (*(char *)(unaff_A6 + 0x2b4) == '0')))) &&
         ((*(short *)(unaff_A6 + 0x2a) == *(short *)(unaff_A6 + 0x2c) &&
          (*(char *)(unaff_A6 + 0x49) == '\0')))) {
        return;
      }
    }
  }
  return;
}



/* 00004542 FUN_00004542 */

void FUN_00004542(void)

{
  char cVar1;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A5 + -0x75af) = 0;
  if (*(char *)(unaff_A6 + 0x38e) == '\0') {
    return;
  }
  if (*(char *)(unaff_A6 + 0x181) == '\0') {
    if (*(char *)(unaff_A5 + 0x2f3) != '\0') {
      return;
    }
    if (*(char *)(unaff_A5 + 0xdd2) != '\0') {
      return;
    }
    if (*(char *)(unaff_A5 + 0xdde) != '\0') {
      return;
    }
    if (*(char *)(unaff_A6 + 3) == '\f') {
      return;
    }
    if ((*(char *)(unaff_A6 + 3) != '\x0e') && (*(char *)(unaff_A6 + 3) != '\x14')) {
      if ((*(char *)(unaff_A6 + 0x38e) != '\0') &&
         ((*(char *)(unaff_A6 + 3) == '\n' ||
          ((*(char *)(unaff_A6 + 3) == '\x04' && (*(char *)(unaff_A6 + 4) == '\x06')))))) {
        if (*(char *)(unaff_A5 + -0x75af) == '\0') {
          cVar1 = *(char *)(unaff_A6 + 0x195);
        }
        else {
          cVar1 = *(char *)(unaff_A6 + 0x2b0);
        }
        if (cVar1 == '\0') {
          return;
        }
      }
      if ((*(char *)(unaff_A5 + -0x75af) != '\0') &&
         (((*(char *)(unaff_A5 + 0x2e3) == '\0' || ((*(byte *)(unaff_A5 + 0x93) & 0x80) == 0)) &&
          (*(char *)(unaff_A6 + 0x2b4) != '0')))) {
        return;
      }
      if (*(short *)(unaff_A6 + 0x2a) != *(short *)(unaff_A6 + 0x2c)) {
        return;
      }
      if (*(char *)(unaff_A6 + 0x49) != '\0') {
        return;
      }
      return;
    }
  }
  else if (*(char *)(unaff_A6 + 3) != '\x0e') {
    return;
  }
  *(undefined1 *)(unaff_A6 + 0x169) = 1;
  return;
}



/* 00004604 FUN_00004604 */

undefined4 FUN_00004604(void)

{
  int iVar1;
  char cVar2;
  short sVar3;
  short sVar4;
  short sVar5;
  undefined4 extraout_A0;
  char *pcVar6;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A5 + -0x75b0) = 1;
  FUN_000b8650();
  *(undefined1 *)(unaff_A5 + -0x75b2) = *(undefined1 *)(unaff_A6 + 0x381);
  if ((((*(char *)(unaff_A6 + 0x191) == '\0') &&
       ((((*(char *)(unaff_A6 + 0x38e) != '\0' || (*(char *)(unaff_A5 + 0x2ef) == '\0')) &&
         (*(char *)(unaff_A6 + 0x49) == '\0')) &&
        ((-1 < *(short *)(unaff_A6 + 0x2a) &&
         (*(short *)(unaff_A6 + 0x2a) == *(short *)(unaff_A6 + 0x2c))))))) &&
      ((pcVar6 = (char *)(int)*(short *)(unaff_A6 + 0x39e), pcVar6[0x49] == '\0' &&
       (((-1 < *(short *)(pcVar6 + 0x2a) && (*(short *)(pcVar6 + 0x2a) == *(short *)(pcVar6 + 0x2c))
         ) && ((*pcVar6 != '\0' && (pcVar6[3] != '\x14')))))))) &&
     (((((pcVar6[0x124] != '\0' || (pcVar6[3] != '\x0e')) && (pcVar6[0x181] == '\0')) &&
       (pcVar6[0x143] == '\0')) &&
      ((((iVar1 = *(int *)(pcVar6 + 0x1a), *(char *)(iVar1 + 8) != '\0' ||
         (*(char *)(iVar1 + 9) != '\0')) || (*(char *)(iVar1 + 10) != '\0')) &&
       ((pcVar6[0x1bf] == '\0' && (pcVar6[0x1a1] == '\0')))))))) {
    sVar5 = *(short *)(unaff_A6 + 100);
    if (*(char *)(unaff_A6 + 0x12) != '\0') {
      sVar5 = -sVar5;
    }
    sVar4 = *(short *)(pcVar6 + 6);
    if (pcVar6[0x2a7] != '\0') {
      sVar4 = *(short *)(pcVar6 + 0x2aa);
      if (pcVar6[0x12] == '\0') {
        sVar4 = -sVar4;
      }
      sVar4 = *(short *)(pcVar6 + 6) + sVar4;
    }
    sVar3 = *(short *)(pcVar6 + 0x6c) + *(short *)(unaff_A6 + 0x68);
    if (((ushort)(sVar3 + ((*(short *)(unaff_A6 + 6) + sVar5) - sVar4)) <= (ushort)(sVar3 * 2)) &&
       ((ushort)(*(short *)(unaff_A6 + 0x6a) +
                ((*(short *)(unaff_A6 + 0x66) + *(short *)(unaff_A6 + 10)) -
                (*(short *)(pcVar6 + 0x6e) + *(short *)(pcVar6 + 10)))) <=
        (ushort)(*(short *)(unaff_A6 + 0x6a) * 2))) {
      if (*(char *)(unaff_A5 + -0x75b0) == '\0') {
        cVar2 = *(char *)(unaff_A5 + 0xdee);
        *(undefined1 *)(unaff_A5 + 0xdee) = 1;
        if (cVar2 == '\0') {
          *(undefined1 *)(unaff_A6 + 0x291) = 2;
          *(undefined1 *)(unaff_A6 + 0x292) = 0;
        }
        pcVar6[400] = '\0';
        pcVar6[0x52] = '\0';
        pcVar6[0x53] = '\0';
        *(undefined1 *)(unaff_A6 + 99) = 1;
        pcVar6[99] = -1;
        pcVar6[700] = '\0';
        pcVar6[0x2bd] = '\0';
        *(undefined1 *)(unaff_A6 + 0x18b) = 0;
        pcVar6[0x18b] = '\0';
        pcVar6[0x195] = '\0';
        pcVar6[0x2b0] = '\0';
        pcVar6[0x2a7] = '\0';
        *(short *)(unaff_A6 + 0x1b0) = *(short *)(unaff_A6 + 0x1b0) + 1;
        pcVar6[0x144] = pcVar6[0x124];
        pcVar6[0x1f1] = pcVar6[0x1f0];
        pcVar6[0x124] = '\0';
        pcVar6[0x1f0] = '\0';
        pcVar6[0x2b5] = '\0';
        *(byte *)(unaff_A5 + 0xdde) =
             *(byte *)(unaff_A5 + 0xdde) | '\x01' << (*(byte *)(unaff_A6 + 0x381) & 7);
        *(undefined4 *)(unaff_A5 + -0x75cc) = extraout_A0;
        FUN_00005b58();
        FUN_00007adc();
      }
      return 1;
    }
  }
  return 0;
}



/* 0000460c FUN_0000460c */

/* WARNING: Removing unreachable block (ram,0x000046ac) */

undefined4 FUN_0000460c(void)

{
  int iVar1;
  char cVar2;
  short sVar3;
  short sVar4;
  short sVar5;
  undefined4 extraout_A0;
  char *pcVar6;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A5 + -0x75b0) = 0;
  FUN_000b8650();
  *(undefined1 *)(unaff_A5 + -0x75b2) = *(undefined1 *)(unaff_A6 + 0x381);
  if (((((*(char *)(unaff_A6 + 0x191) == '\0') &&
        ((((*(char *)(unaff_A6 + 0x38e) != '\0' || (*(char *)(unaff_A5 + 0x2ef) == '\0')) &&
          (*(char *)(unaff_A6 + 0x49) == '\0')) &&
         ((-1 < *(short *)(unaff_A6 + 0x2a) &&
          (*(short *)(unaff_A6 + 0x2a) == *(short *)(unaff_A6 + 0x2c))))))) &&
       (pcVar6 = (char *)(int)*(short *)(unaff_A6 + 0x39e), pcVar6[0x49] == '\0')) &&
      (((-1 < *(short *)(pcVar6 + 0x2a) && (*(short *)(pcVar6 + 0x2a) == *(short *)(pcVar6 + 0x2c)))
       && ((*pcVar6 != '\0' && (pcVar6[3] != '\x14')))))) &&
     (((((pcVar6[0x124] != '\0' || (pcVar6[3] != '\x0e')) && (pcVar6[0x143] == '\0')) &&
       (((iVar1 = *(int *)(pcVar6 + 0x1a), *(char *)(iVar1 + 8) != '\0' ||
         (*(char *)(iVar1 + 9) != '\0')) || (*(char *)(iVar1 + 10) != '\0')))) &&
      ((pcVar6[0x1bf] == '\0' && (pcVar6[0x1a1] == '\0')))))) {
    sVar5 = *(short *)(unaff_A6 + 100);
    if (*(char *)(unaff_A6 + 0x12) != '\0') {
      sVar5 = -sVar5;
    }
    sVar4 = *(short *)(pcVar6 + 6);
    if (pcVar6[0x2a7] != '\0') {
      sVar4 = *(short *)(pcVar6 + 0x2aa);
      if (pcVar6[0x12] == '\0') {
        sVar4 = -sVar4;
      }
      sVar4 = *(short *)(pcVar6 + 6) + sVar4;
    }
    sVar3 = *(short *)(pcVar6 + 0x6c) + *(short *)(unaff_A6 + 0x68);
    if (((ushort)(sVar3 + ((*(short *)(unaff_A6 + 6) + sVar5) - sVar4)) <= (ushort)(sVar3 * 2)) &&
       ((ushort)(*(short *)(unaff_A6 + 0x6a) +
                ((*(short *)(unaff_A6 + 0x66) + *(short *)(unaff_A6 + 10)) -
                (*(short *)(pcVar6 + 0x6e) + *(short *)(pcVar6 + 10)))) <=
        (ushort)(*(short *)(unaff_A6 + 0x6a) * 2))) {
      if (*(char *)(unaff_A5 + -0x75b0) == '\0') {
        cVar2 = *(char *)(unaff_A5 + 0xdee);
        *(undefined1 *)(unaff_A5 + 0xdee) = 1;
        if (cVar2 == '\0') {
          *(undefined1 *)(unaff_A6 + 0x291) = 2;
          *(undefined1 *)(unaff_A6 + 0x292) = 0;
        }
        pcVar6[400] = '\0';
        pcVar6[0x52] = '\0';
        pcVar6[0x53] = '\0';
        *(undefined1 *)(unaff_A6 + 99) = 1;
        pcVar6[99] = -1;
        pcVar6[700] = '\0';
        pcVar6[0x2bd] = '\0';
        *(undefined1 *)(unaff_A6 + 0x18b) = 0;
        pcVar6[0x18b] = '\0';
        pcVar6[0x195] = '\0';
        pcVar6[0x2b0] = '\0';
        pcVar6[0x2a7] = '\0';
        *(short *)(unaff_A6 + 0x1b0) = *(short *)(unaff_A6 + 0x1b0) + 1;
        pcVar6[0x144] = pcVar6[0x124];
        pcVar6[0x1f1] = pcVar6[0x1f0];
        pcVar6[0x124] = '\0';
        pcVar6[0x1f0] = '\0';
        pcVar6[0x2b5] = '\0';
        *(byte *)(unaff_A5 + 0xdde) =
             *(byte *)(unaff_A5 + 0xdde) | '\x01' << (*(byte *)(unaff_A6 + 0x381) & 7);
        *(undefined4 *)(unaff_A5 + -0x75cc) = extraout_A0;
        FUN_00005b58();
        FUN_00007adc();
      }
      return 1;
    }
  }
  return 0;
}



/* 0000461e FUN_0000461e */

undefined4 FUN_0000461e(void)

{
  int iVar1;
  char cVar2;
  short sVar3;
  short sVar4;
  short sVar5;
  undefined4 extraout_A0;
  char *pcVar6;
  int unaff_A5;
  int unaff_A6;
  
  if (*(char *)(unaff_A6 + 0x2be) == '\0') {
    *(undefined1 *)(unaff_A5 + -0x75b0) = 0;
    FUN_000b8650();
    *(undefined1 *)(unaff_A5 + -0x75b2) = *(undefined1 *)(unaff_A6 + 0x381);
    if ((((*(char *)(unaff_A6 + 0x191) == '\0') &&
         ((((*(char *)(unaff_A6 + 0x38e) != '\0' || (*(char *)(unaff_A5 + 0x2ef) == '\0')) &&
           (*(char *)(unaff_A6 + 0x49) == '\0')) &&
          ((-1 < *(short *)(unaff_A6 + 0x2a) &&
           (*(short *)(unaff_A6 + 0x2a) == *(short *)(unaff_A6 + 0x2c))))))) &&
        ((pcVar6 = (char *)(int)*(short *)(unaff_A6 + 0x39e), pcVar6[0x49] == '\0' &&
         (((-1 < *(short *)(pcVar6 + 0x2a) &&
           (*(short *)(pcVar6 + 0x2a) == *(short *)(pcVar6 + 0x2c))) &&
          ((*pcVar6 != '\0' && (pcVar6[3] != '\x14')))))))) &&
       (((((pcVar6[0x124] != '\0' || (pcVar6[3] != '\x0e')) && (pcVar6[0x181] == '\0')) &&
         (pcVar6[0x143] == '\0')) &&
        ((((iVar1 = *(int *)(pcVar6 + 0x1a), *(char *)(iVar1 + 8) != '\0' ||
           (*(char *)(iVar1 + 9) != '\0')) || (*(char *)(iVar1 + 10) != '\0')) &&
         ((pcVar6[0x1bf] == '\0' && (pcVar6[0x1a1] == '\0')))))))) {
      sVar5 = *(short *)(unaff_A6 + 100);
      if (*(char *)(unaff_A6 + 0x12) != '\0') {
        sVar5 = -sVar5;
      }
      sVar4 = *(short *)(pcVar6 + 6);
      if (pcVar6[0x2a7] != '\0') {
        sVar4 = *(short *)(pcVar6 + 0x2aa);
        if (pcVar6[0x12] == '\0') {
          sVar4 = -sVar4;
        }
        sVar4 = *(short *)(pcVar6 + 6) + sVar4;
      }
      sVar3 = *(short *)(pcVar6 + 0x6c) + *(short *)(unaff_A6 + 0x68);
      if (((ushort)(sVar3 + ((*(short *)(unaff_A6 + 6) + sVar5) - sVar4)) <= (ushort)(sVar3 * 2)) &&
         ((ushort)(*(short *)(unaff_A6 + 0x6a) +
                  ((*(short *)(unaff_A6 + 0x66) + *(short *)(unaff_A6 + 10)) -
                  (*(short *)(pcVar6 + 0x6e) + *(short *)(pcVar6 + 10)))) <=
          (ushort)(*(short *)(unaff_A6 + 0x6a) * 2))) {
        if (*(char *)(unaff_A5 + -0x75b0) == '\0') {
          cVar2 = *(char *)(unaff_A5 + 0xdee);
          *(undefined1 *)(unaff_A5 + 0xdee) = 1;
          if (cVar2 == '\0') {
            *(undefined1 *)(unaff_A6 + 0x291) = 2;
            *(undefined1 *)(unaff_A6 + 0x292) = 0;
          }
          pcVar6[400] = '\0';
          pcVar6[0x52] = '\0';
          pcVar6[0x53] = '\0';
          *(undefined1 *)(unaff_A6 + 99) = 1;
          pcVar6[99] = -1;
          pcVar6[700] = '\0';
          pcVar6[0x2bd] = '\0';
          *(undefined1 *)(unaff_A6 + 0x18b) = 0;
          pcVar6[0x18b] = '\0';
          pcVar6[0x195] = '\0';
          pcVar6[0x2b0] = '\0';
          pcVar6[0x2a7] = '\0';
          *(short *)(unaff_A6 + 0x1b0) = *(short *)(unaff_A6 + 0x1b0) + 1;
          pcVar6[0x144] = pcVar6[0x124];
          pcVar6[0x1f1] = pcVar6[0x1f0];
          pcVar6[0x124] = '\0';
          pcVar6[0x1f0] = '\0';
          pcVar6[0x2b5] = '\0';
          *(byte *)(unaff_A5 + 0xdde) =
               *(byte *)(unaff_A5 + 0xdde) | '\x01' << (*(byte *)(unaff_A6 + 0x381) & 7);
          *(undefined4 *)(unaff_A5 + -0x75cc) = extraout_A0;
          FUN_00005b58();
          FUN_00007adc();
        }
        return 1;
      }
    }
  }
  return 0;
}



/* 00004a20 FUN_00004a20 */

void FUN_00004a20(void)

{
  FUN_00007ca0();
  return;
}



/* 00004a26 FUN_00004a26 */

void FUN_00004a26(void)

{
  undefined1 *unaff_A4;
  int unaff_A5;
  undefined1 in_ZF;
  
  FUN_00003778();
  if (!(bool)in_ZF) {
    *(undefined1 *)(unaff_A5 + 0xdeb) = 1;
    *unaff_A4 = 1;
    unaff_A4[0x20] = 0x38;
    unaff_A4[0x21] = 1;
    unaff_A4[0x46] = 1;
  }
  return;
}



/* 00004aa8 FUN_00004aa8 */

void FUN_00004aa8(void)

{
  FUN_00004ab0();
  FUN_00004bfa();
  return;
}



/* 00004ab0 FUN_00004ab0 */

ushort FUN_00004ab0(void)

{
  ushort uVar1;
  short sVar2;
  ushort in_D0w;
  ushort unaff_D2w;
  short sVar3;
  int unaff_A3;
  int unaff_A5;
  
  *(ushort *)(unaff_A5 + -0x75b6) = unaff_D2w;
  if ((unaff_D2w & 0x3f) < 0x20) {
    sVar3 = (unaff_D2w & 0x3f) * 2;
    *(undefined2 *)(unaff_A5 + -0x75b8) = *(undefined2 *)(&DAT_0024ea54 + sVar3);
    if ((*(ushort *)(unaff_A5 + -0x75b6) & 0x80) != 0) {
      *(undefined2 *)(unaff_A5 + -0x75b8) = *(undefined2 *)(&DAT_0024ea76 + sVar3);
    }
    return in_D0w;
  }
  sVar3 = (unaff_D2w & 0x3f) - 0x20;
  sVar2 = sVar3 * 2;
  *(undefined2 *)(unaff_A5 + -0x75b8) = *(undefined2 *)(&DAT_0024ead8 + sVar2);
  if ((*(ushort *)(unaff_A5 + -0x75b6) & 0x80) != 0) {
    *(undefined2 *)(unaff_A5 + -0x75b8) = *(undefined2 *)(&DAT_0024ea76 + sVar2);
  }
  sVar3 = sVar3 * 0x10;
  uVar1 = *(ushort *)(unaff_A3 + 0x2a);
  if (uVar1 <= *(ushort *)(&DAT_0024ea9a + sVar3)) {
    return uVar1;
  }
  if (*(ushort *)(&DAT_0024ea9e + sVar3) <= uVar1) {
    return uVar1;
  }
  return (short)uVar1 >> (*(ushort *)(&DAT_0024ea98 + sVar3) & 0x3f);
}



/* 00004b86 FUN_00004b86 */

void FUN_00004b86(void)

{
  undefined4 extraout_D1;
  undefined4 unaff_D2;
  undefined4 unaff_D3;
  int unaff_A5;
  
  FUN_00004ab0();
  *(undefined4 *)(unaff_A5 + -0x75c8) = extraout_D1;
  *(undefined4 *)(unaff_A5 + -0x75c4) = unaff_D2;
  *(undefined4 *)(unaff_A5 + -0x75c0) = unaff_D3;
  FUN_00002e96();
  FUN_00004bfa();
  return;
}



/* 00004bfa FUN_00004bfa */

void FUN_00004bfa(void)

{
  return;
}



/* 00004d2e FUN_00004d2e */

void FUN_00004d2e(void)

{
  char cVar1;
  char cVar2;
  short sVar3;
  undefined1 in_D0b;
  ushort uVar4;
  undefined1 in_D1b;
  short unaff_D4w;
  int iVar5;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A5 + -0x75ad) = 0;
  *(undefined1 *)(unaff_A5 + -0x75b1) = 0;
  iVar5 = (int)*(short *)(unaff_A6 + 0x39e);
  *(undefined1 *)(iVar5 + 0x76) = in_D0b;
  *(undefined1 *)(iVar5 + 0x54) = in_D1b;
  *(undefined2 *)(unaff_A5 + -0x75b4) = 0;
  *(undefined1 *)(unaff_A5 + -0x75ae) = 0;
  FUN_00004ee4();
  FUN_00004a20();
  if (((*(char *)(unaff_A5 + 0xd68) == '\0') && (*(char *)(unaff_A5 + 0x317) == '\0')) &&
     (*(char *)(unaff_A5 + 0xdd2) == '\0')) {
    if (*(char *)(unaff_A5 + -0x75b1) == '\0') {
      FUN_00004aa8();
    }
    else {
      FUN_00004b86();
    }
    if (*(char *)(unaff_A5 + 0xd63) == '\0') {
      FUN_00002ca6();
    }
    *(short *)(unaff_A5 + -0x75b4) = unaff_D4w;
    *(undefined1 *)(unaff_A5 + -0x75ae) = 0;
    *(short *)(iVar5 + 0x2a) = *(short *)(iVar5 + 0x2a) - unaff_D4w;
    sVar3 = *(short *)(iVar5 + 0x2c) - unaff_D4w;
    *(short *)(iVar5 + 0x2c) = sVar3;
    if (sVar3 < 0) {
      *(undefined1 *)(unaff_A5 + -0x75ae) = 1;
      *(undefined2 *)(iVar5 + 0x2a) = 0xffff;
      *(undefined2 *)(iVar5 + 0x2c) = 0xffff;
      if (*(char *)(iVar5 + 0x76) == '\x10') {
        *(undefined2 *)(iVar5 + 0x2a) = 0;
        *(undefined2 *)(iVar5 + 0x2c) = 0;
      }
      else {
        if (*(char *)(unaff_A5 + -0x75b5) < '\0') {
          if (*(char *)(unaff_A5 + -0x75ad) != '\0') {
            *(undefined1 *)(iVar5 + 0x2c2) = 1;
          }
          *(undefined1 *)(unaff_A5 + 0xdf2) = *(undefined1 *)(unaff_A6 + 0x381);
          *(char *)(unaff_A5 + 0xdf2) = *(char *)(unaff_A5 + 0xdf2) + '\x01';
        }
        FUN_00004a26();
      }
    }
  }
  *(undefined1 *)(iVar5 + 3) = 0x14;
  *(undefined1 *)(iVar5 + 4) = 0;
  *(undefined1 *)(iVar5 + 5) = 0;
  cVar1 = *(char *)(iVar5 + 0x144);
  cVar2 = *(char *)(iVar5 + 0x1f1);
  *(undefined1 *)(iVar5 + 0x144) = 0;
  *(undefined1 *)(iVar5 + 0x1f1) = 0;
  if (((cVar2 == '\0' && cVar1 == '\0') && (-1 < *(short *)(iVar5 + 0x2a))) &&
     ((FUN_00004f1c(), *(char *)(iVar5 + 0x123) == '\0' &&
      ((*(char *)(unaff_A5 + -0x75ae) == '\0' && (*(char *)(iVar5 + 0x2bd) != '\0')))))) {
    iVar5 = (int)*(short *)(unaff_A6 + 0x39e);
    uVar4 = *(ushort *)(unaff_A5 + -0x75b4) >> 1;
    *(short *)(iVar5 + 0x2a) = uVar4 + *(short *)(iVar5 + 0x2a);
    *(short *)(iVar5 + 0x2c) = uVar4 + *(short *)(iVar5 + 0x2c);
    *(undefined1 *)(iVar5 + 3) = 0xe;
    *(undefined1 *)(iVar5 + 4) = 0;
    *(undefined1 *)(iVar5 + 5) = 0;
    *(undefined1 *)(iVar5 + 0x4b) = 0x10;
    *(undefined1 *)(iVar5 + 0x55) = 0x10;
    *(undefined1 *)(iVar5 + 0x49) = 0;
  }
  *(undefined1 *)(unaff_A5 + 0xde0) = 0x1c;
  *(undefined1 *)(unaff_A6 + 0x2bf) = 0;
  *(undefined1 *)(unaff_A5 + 0xdde) = 0;
  *(undefined1 *)(unaff_A6 + 99) = 0;
  *(undefined1 *)(iVar5 + 99) = 0;
  *(undefined1 *)(iVar5 + 0x18b) = 0;
  return;
}



/* 00004ee4 FUN_00004ee4 */

void FUN_00004ee4(void)

{
  undefined1 unaff_D3b;
  short unaff_D4w;
  short unaff_D5w;
  int unaff_A3;
  undefined1 *unaff_A4;
  int unaff_A6;
  undefined1 in_ZF;
  
  FUN_00003778();
  if (!(bool)in_ZF) {
    *unaff_A4 = 1;
    unaff_A4[0x20] = 0x20;
    unaff_A4[0x21] = unaff_D3b;
    *(undefined2 *)(unaff_A4 + 6) = *(undefined2 *)(unaff_A6 + 6);
    *(undefined2 *)(unaff_A4 + 10) = *(undefined2 *)(unaff_A6 + 10);
    *(short *)(unaff_A4 + 6) = unaff_D4w + *(short *)(unaff_A4 + 6);
    *(short *)(unaff_A4 + 10) = unaff_D5w + *(short *)(unaff_A4 + 10);
    *(short *)(unaff_A4 + 0x26) = (short)unaff_A6;
    unaff_A4[0x12] = *(undefined1 *)(unaff_A3 + 0x12);
  }
  return;
}



/* 00004f1c FUN_00004f1c */

void FUN_00004f1c(void)

{
  int unaff_A3;
  int unaff_A5;
  int unaff_A6;
  
  if (*(char *)(unaff_A3 + 0x123) == '\0') {
    *(undefined2 *)(unaff_A5 + -0x75ce) = 10;
    *(short *)(unaff_A3 + 0x5c) = *(short *)(unaff_A3 + 0x5c) + 100;
    FUN_0007f2ae();
    *(short *)(unaff_A3 + 0x5e) = *(short *)(unaff_A5 + -0x75ce) + *(short *)(unaff_A3 + 0x5e);
    if (*(ushort *)(unaff_A3 + 0x5e) <
        *(ushort *)(&DAT_0007f1c6 + (short)(ushort)*(byte *)(unaff_A6 + 0x2b1))) {
      return;
    }
    *(char *)(unaff_A6 + 0x2b1) = *(char *)(unaff_A6 + 0x2b1) + '\x02';
    *(byte *)(unaff_A6 + 0x2b1) = *(byte *)(unaff_A6 + 0x2b1) & 0x1e;
  }
  *(char *)(unaff_A3 + 0x256) = *(char *)(unaff_A3 + 0x256) + '\x01';
  *(undefined1 *)(unaff_A3 + 0x123) = 1;
  *(undefined2 *)(unaff_A3 + 0x5e) = 0;
  *(undefined2 *)(unaff_A3 + 0x5c) = 0;
  return;
}



/* 0000524e FUN_0000524e */

/* WARNING: Control flow encountered bad instruction data */
/* WARNING: Switch with 1 destination removed at 0x0000528a */
/* WARNING: Exceeded maximum restarts with more pending */

void FUN_0000524e(void)

{
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}



/* 00005256 FUN_00005256 */

/* WARNING: Control flow encountered bad instruction data */
/* WARNING: Switch with 1 destination removed at 0x0000528a */
/* WARNING: Exceeded maximum restarts with more pending */

void FUN_00005256(void)

{
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}



/* 00005444 FUN_00005444 */

short FUN_00005444(void)

{
  ushort in_D0w;
  ushort in_D1w;
  
  return ((~in_D1w & 0xf0) >> 2) + (~in_D1w & 0x300) * 0x10 + (in_D0w & 0x3f0) * 4;
}



/* 00005468 FUN_00005468 */

short FUN_00005468(void)

{
  int unaff_A6;
  
  return ((~*(ushort *)(unaff_A6 + 10) & 0xe0) >> 3) + (~*(ushort *)(unaff_A6 + 10) & 0x700) * 8 +
         (*(ushort *)(unaff_A6 + 6) & 0x7e0);
}



/* 000054e2 FUN_000054e2 */

void FUN_000054e2(void)

{
  int unaff_A5;
  int unaff_A6;
  
  if (((ushort)((*(short *)(unaff_A6 + 6) - *(short *)(unaff_A5 + 0xf54)) + 0x80U) < 0x281) &&
     ((ushort)((*(short *)(unaff_A6 + 10) - *(short *)(unaff_A5 + 0xf58)) + 0x80U) < 0x201)) {
    return;
  }
  return;
}



/* 000056e2 FUN_000056e2 */

undefined4 FUN_000056e2(void)

{
  short in_D1w;
  short sVar1;
  short unaff_D3w;
  short sVar2;
  short unaff_D4w;
  short sVar3;
  short *psVar4;
  short *in_A0;
  int iVar5;
  int iVar6;
  short *in_A1;
  int *piVar7;
  
  if (in_D1w == 0) {
    sVar2 = unaff_D3w + -1;
    sVar1 = unaff_D4w + -1;
    psVar4 = in_A0;
    do {
      do {
        if (-1 < *in_A1) {
          *in_A0 = *in_A1 + 0x2000;
          in_A0[1] = in_A1[1];
        }
        in_A1 = in_A1 + 2;
        in_A0 = in_A0 + 2;
        sVar1 = sVar1 + -1;
      } while (sVar1 != -1);
      in_A0 = psVar4 + 0x20;
      sVar2 = sVar2 + -1;
      sVar1 = unaff_D4w + -1;
      psVar4 = in_A0;
    } while (sVar2 != -1);
    return 0;
  }
  piVar7 = (int *)((int)in_A1 + (int)(short)(unaff_D4w * unaff_D3w * 4));
  sVar2 = unaff_D3w + -1;
  sVar1 = unaff_D4w + -1;
  iVar6 = (int)in_A0 + (short)(sVar1 * 4) + 4;
  sVar3 = sVar1;
  iVar5 = iVar6;
  do {
    do {
      piVar7 = piVar7 + -1;
      if (-1 < *piVar7) {
        *(uint *)(iVar6 + -4) = *piVar7 + 0x20000000U ^ 0x20;
      }
      iVar6 = iVar6 + -4;
      sVar3 = sVar3 + -1;
    } while (sVar3 != -1);
    iVar6 = iVar5 + 0x40;
    sVar2 = sVar2 + -1;
    sVar3 = sVar1;
    iVar5 = iVar6;
  } while (sVar2 != -1);
  return 0;
}



/* 00005756 FUN_00005756 */

undefined4 FUN_00005756(void)

{
  short in_D1w;
  short sVar1;
  short unaff_D3w;
  short sVar2;
  short unaff_D4w;
  short sVar3;
  short *in_A0;
  uint *puVar4;
  short *psVar5;
  short *in_A1;
  int *piVar6;
  short *psVar7;
  uint *puVar8;
  short *psVar9;
  
  if (in_D1w == 0) {
    sVar2 = unaff_D3w + -1;
    sVar1 = unaff_D4w + -1;
    psVar5 = in_A0;
    do {
      do {
        psVar7 = in_A1 + 1;
        psVar9 = in_A0 + 1;
        *in_A0 = *in_A1 + 0x2000;
        in_A1 = in_A1 + 2;
        in_A0 = in_A0 + 2;
        *psVar9 = *psVar7;
        sVar1 = sVar1 + -1;
      } while (sVar1 != -1);
      in_A0 = psVar5 + 0x20;
      sVar2 = sVar2 + -1;
      sVar1 = unaff_D4w + -1;
      psVar5 = in_A0;
    } while (sVar2 != -1);
    return 0;
  }
  piVar6 = (int *)((int)in_A1 + (int)(short)(unaff_D4w * unaff_D3w * 4));
  sVar2 = unaff_D3w + -1;
  sVar1 = unaff_D4w + -1;
  puVar8 = (uint *)((int)in_A0 + (short)(sVar1 * 4) + 4);
  sVar3 = sVar1;
  puVar4 = puVar8;
  do {
    do {
      piVar6 = piVar6 + -1;
      puVar8 = puVar8 + -1;
      *puVar8 = *piVar6 + 0x20000000U ^ 0x20;
      sVar3 = sVar3 + -1;
    } while (sVar3 != -1);
    puVar8 = puVar4 + 0x10;
    sVar2 = sVar2 + -1;
    sVar3 = sVar1;
    puVar4 = puVar8;
  } while (sVar2 != -1);
  return 0;
}



/* 00005b58 FUN_00005b58 */

void FUN_00005b58(void)

{
  ushort uVar1;
  undefined *puVar2;
  int unaff_A5;
  bool bVar3;
  
  *(short *)(unaff_A5 + 0xc8c) = *(short *)(unaff_A5 + 0xc8c) + 2;
  if (((*(char *)(unaff_A5 + 0x349) == '\0') && (*(char *)(unaff_A5 + 0x2e6) == '\0')) &&
     (*(char *)(unaff_A5 + 0x317) == '\0')) {
    bVar3 = *(char *)(unaff_A5 + 0xca0) == '\0';
    if ((bVar3) && (FUN_00004018(), !bVar3)) {
      puVar2 = &DAT_0024ddf4;
      if (((*(short *)(unaff_A5 + 0x2ce) == 4) ||
          ((*(short *)(unaff_A5 + 0x2ce) == 6 || (*(short *)(unaff_A5 + 0x2ce) == 2)))) ||
         (*(short *)(unaff_A5 + 0x2ce) == 8)) {
        puVar2 = &DAT_0024dff4;
      }
      *(undefined4 *)(unaff_A5 + 0xc8e) =
           *(undefined4 *)
            (puVar2 + (short)(*(short *)(unaff_A5 + 0xc9e) * 4 + *(short *)(unaff_A5 + 0x2d2) * 0x40
                             ));
      uVar1 = *(ushort *)(unaff_A5 + 0xc8c);
      if (0xff < uVar1) {
        uVar1 = 0xff;
        *(undefined2 *)(unaff_A5 + 0xc8c) = 0xff;
      }
      if (uVar1 < *(ushort *)(unaff_A5 + 0xc8e)) {
        uVar1 = *(ushort *)(unaff_A5 + 0xc8e);
      }
      if (*(ushort *)(unaff_A5 + 0xc90) <= uVar1) {
        uVar1 = *(ushort *)(unaff_A5 + 0xc90);
      }
      *(ushort *)(unaff_A5 + 0xc8c) = uVar1;
      *(short *)(unaff_A5 + 0xc52) = (short)(char)(&DAT_00005db8)[(short)uVar1];
      return;
    }
    *(undefined2 *)(unaff_A5 + 0xc8e) = 0x69;
    *(undefined2 *)(unaff_A5 + 0xc90) = 0xff;
    *(undefined2 *)(unaff_A5 + 0xc52) = 0x1f;
    return;
  }
  return;
}



/* 00005b60 FUN_00005b60 */

void FUN_00005b60(void)

{
  ushort uVar1;
  undefined *puVar2;
  int unaff_A5;
  bool bVar3;
  
  if ((((*(char *)(unaff_A5 + 0x2e5) != '\x03') &&
       (*(short *)(unaff_A5 + 0xc8c) = *(short *)(unaff_A5 + 0xc8c) + 1,
       *(char *)(unaff_A5 + 0x349) == '\0')) && (*(char *)(unaff_A5 + 0x2e6) == '\0')) &&
     (*(char *)(unaff_A5 + 0x317) == '\0')) {
    bVar3 = *(char *)(unaff_A5 + 0xca0) == '\0';
    if ((bVar3) && (FUN_00004018(), !bVar3)) {
      puVar2 = &DAT_0024ddf4;
      if (((*(short *)(unaff_A5 + 0x2ce) == 4) ||
          ((*(short *)(unaff_A5 + 0x2ce) == 6 || (*(short *)(unaff_A5 + 0x2ce) == 2)))) ||
         (*(short *)(unaff_A5 + 0x2ce) == 8)) {
        puVar2 = &DAT_0024dff4;
      }
      *(undefined4 *)(unaff_A5 + 0xc8e) =
           *(undefined4 *)
            (puVar2 + (short)(*(short *)(unaff_A5 + 0xc9e) * 4 + *(short *)(unaff_A5 + 0x2d2) * 0x40
                             ));
      uVar1 = *(ushort *)(unaff_A5 + 0xc8c);
      if (0xff < uVar1) {
        uVar1 = 0xff;
        *(undefined2 *)(unaff_A5 + 0xc8c) = 0xff;
      }
      if (uVar1 < *(ushort *)(unaff_A5 + 0xc8e)) {
        uVar1 = *(ushort *)(unaff_A5 + 0xc8e);
      }
      if (*(ushort *)(unaff_A5 + 0xc90) <= uVar1) {
        uVar1 = *(ushort *)(unaff_A5 + 0xc90);
      }
      *(ushort *)(unaff_A5 + 0xc8c) = uVar1;
      *(short *)(unaff_A5 + 0xc52) = (short)(char)(&DAT_00005db8)[(short)uVar1];
      return;
    }
    *(undefined2 *)(unaff_A5 + 0xc8e) = 0x69;
    *(undefined2 *)(unaff_A5 + 0xc90) = 0xff;
    *(undefined2 *)(unaff_A5 + 0xc52) = 0x1f;
    return;
  }
  return;
}



/* 000060d0 FUN_000060d0 */

void FUN_000060d0(void)

{
  short in_D0w;
  undefined2 in_D1w;
  undefined2 unaff_D2w;
  undefined2 *in_A0;
  undefined2 *puVar1;
  
  do {
    puVar1 = in_A0 + 1;
    *in_A0 = in_D1w;
    in_A0 = in_A0 + 2;
    *puVar1 = unaff_D2w;
    in_D0w = in_D0w + -1;
  } while (in_D0w != -1);
  return;
}



/* 000063a2 FUN_000063a2 */

void FUN_000063a2(void)

{
  short sVar1;
  byte bVar2;
  byte bVar3;
  char cVar4;
  short sVar5;
  ushort uVar6;
  ushort uVar7;
  undefined1 uVar8;
  ushort extraout_D1w;
  ushort uVar10;
  int iVar9;
  ushort uVar11;
  short sVar12;
  short sVar13;
  ushort *puVar14;
  undefined2 *puVar15;
  ushort *extraout_A0;
  ushort *extraout_A0_00;
  int *piVar16;
  byte *pbVar17;
  char *pcVar18;
  byte *pbVar19;
  char *pcVar20;
  short *psVar21;
  short *psVar22;
  ushort *extraout_A1;
  ushort *extraout_A1_00;
  ushort *puVar23;
  short *unaff_A3;
  int unaff_A5;
  int unaff_A6;
  ushort *puVar24;
  
  cVar4 = *(char *)(unaff_A6 + 0x11);
  uVar8 = (undefined1)((ushort)((short)*(char *)(unaff_A6 + 0x15) << 2) >> 8);
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Could not find normalized switch variable to match jumptable */
  switch(*(char *)(unaff_A6 + 0x15)) {
  case '\0':
    sVar13 = CONCAT11(uVar8,cVar4 << 1);
    if (cVar4 < '\0') {
      pbVar19 = &DAT_0001aed2 + *(short *)(&DAT_0001aed0 + sVar13);
      do {
        puVar15 = (undefined2 *)((ushort)((ushort)pbVar19[1] + (ushort)*pbVar19 * 0x80) + 0x90c000);
        pbVar17 = pbVar19 + 3;
        while( true ) {
          pbVar19 = pbVar17 + 1;
          if (*pbVar17 == 0) {
            return;
          }
          if (*pbVar17 == 0x2f) break;
          *puVar15 = 0x20;
          puVar15[1] = 0;
          puVar15 = puVar15 + 0x40;
          pbVar17 = pbVar19;
        }
      } while( true );
    }
    pbVar19 = &DAT_0001aed2 + *(short *)(&DAT_0001aed0 + sVar13);
    do {
      puVar14 = (ushort *)((short)((ushort)pbVar19[1] + (ushort)*pbVar19 * 0x80) + 0x90c000);
      bVar2 = pbVar19[2];
      pbVar17 = pbVar19 + 3;
      while( true ) {
        pbVar19 = pbVar17 + 1;
        bVar3 = *pbVar17;
        if (bVar3 == 0) {
          return;
        }
        if (bVar3 == 0x2f) break;
        *puVar14 = (ushort)bVar3;
        puVar14[1] = (ushort)bVar2;
        puVar14 = puVar14 + 0x40;
        pbVar17 = pbVar19;
      }
    } while( true );
  case '\x02':
    *(undefined2 *)(unaff_A5 + -0x759c) = 0;
    sVar13 = CONCAT11(uVar8,cVar4 << 1);
    if (cVar4 < '\0') {
      pcVar20 = &DAT_0001c4d6 + *(short *)(&DAT_0001c4d4 + sVar13);
      piVar16 = (int *)(&DAT_00708fb0 +
                       *(ushort *)(&DAT_0001c4d4 + *(short *)(&DAT_0001c4d4 + sVar13)));
      do {
        iVar9 = (uint)*(ushort *)(unaff_A5 + 0x2c2) << 0x10;
        pcVar18 = pcVar20 + 5;
        while( true ) {
          pcVar20 = pcVar18 + 1;
          cVar4 = *pcVar18;
          if (cVar4 == '\0') goto LAB_00006bf2;
          if (cVar4 == '/') break;
          pcVar18 = pcVar20;
          if (cVar4 != ' ') {
            *piVar16 = iVar9;
            *(undefined2 *)(piVar16 + 1) = 0;
            *(undefined2 *)((int)piVar16 + 6) = 0;
            piVar16[0x81c14] = iVar9;
            *(undefined2 *)(piVar16 + 0x81c15) = 0;
            *(undefined2 *)((int)piVar16 + 0x207056) = 0;
            piVar16 = piVar16 + 2;
          }
        }
      } while( true );
    }
    pbVar19 = &DAT_0001c4d6 + *(short *)(&DAT_0001c4d4 + sVar13);
    piVar16 = (int *)(&DAT_00708fb0 +
                     *(ushort *)(&DAT_0001c4d4 + *(short *)(&DAT_0001c4d4 + sVar13)));
    do {
      uVar11 = *(ushort *)(unaff_A5 + 0x2c2) | *(short *)pbVar19 + 0x40U;
      if (*(short *)(unaff_A5 + -0x759c) != 0) {
        uVar11 = *(ushort *)(unaff_A5 + -0x759c) | uVar11 & 0x1fff;
      }
      iVar9 = CONCAT22(uVar11,(short)CONCAT31(CONCAT21(uVar11,pbVar19[2]),~pbVar19[3]) + 1);
      bVar2 = pbVar19[4];
      pbVar17 = pbVar19 + 5;
      while( true ) {
        pbVar19 = pbVar17 + 1;
        bVar3 = *pbVar17;
        if (bVar3 == 0) goto LAB_00006bf2;
        if (bVar3 == 0x2f) break;
        if (bVar3 != 0x20) {
          *piVar16 = iVar9;
          *(ushort *)(piVar16 + 1) = bVar3 + 0x8080;
          *(ushort *)((int)piVar16 + 6) = bVar2 & 0x1f;
          piVar16[0x81c14] = iVar9;
          *(ushort *)(piVar16 + 0x81c15) = bVar3 + 0x8080;
          *(ushort *)((int)piVar16 + 0x207056) = bVar2 & 0x1f;
          piVar16 = piVar16 + 2;
        }
        iVar9 = iVar9 + 0xc0000;
        pbVar17 = pbVar19;
      }
    } while( true );
  case '\x03':
    *(undefined2 *)(unaff_A5 + -0x759c) = 0;
    sVar13 = CONCAT11(uVar8,cVar4 << 1);
    if (cVar4 < '\0') {
      psVar21 = (short *)(&DAT_0001c5e2 + *(short *)(&DAT_0001c5e0 + sVar13));
      piVar16 = (int *)(&DAT_00708fb0 +
                       *(ushort *)(&DAT_0001c5e0 + *(short *)(&DAT_0001c5e0 + sVar13)));
      do {
        iVar9 = (uint)*(ushort *)(unaff_A5 + 0x2c2) << 0x10;
        psVar22 = psVar21 + 3;
        while( true ) {
          psVar21 = psVar22 + 1;
          if (*psVar22 == 0) goto LAB_00006bf2;
          if (*psVar22 == -1) break;
          *piVar16 = iVar9;
          *(undefined2 *)(piVar16 + 1) = 0;
          *(undefined2 *)((int)piVar16 + 6) = 0;
          piVar16[0x81c14] = iVar9;
          *(undefined2 *)(piVar16 + 0x81c15) = 0;
          *(undefined2 *)((int)piVar16 + 0x207056) = 0;
          piVar16 = piVar16 + 2;
          psVar22 = psVar21;
        }
      } while( true );
    }
    psVar21 = (short *)(&DAT_0001c5e2 + *(short *)(&DAT_0001c5e0 + sVar13));
    piVar16 = (int *)(&DAT_00708fb0 +
                     *(ushort *)(&DAT_0001c5e0 + *(short *)(&DAT_0001c5e0 + sVar13)));
    do {
      uVar11 = *(ushort *)(unaff_A5 + 0x2c2) | *psVar21 + 0x40U;
      if (*(short *)(unaff_A5 + -0x759c) != 0) {
        uVar11 = *(ushort *)(unaff_A5 + -0x759c) | uVar11 & 0x1fff;
      }
      iVar9 = CONCAT22(uVar11,(short)CONCAT31((int3)(CONCAT22(uVar11,psVar21[1]) >> 8),
                                              ~(byte)psVar21[1]) + 1);
      sVar13 = psVar21[2];
      psVar22 = psVar21 + 3;
      while( true ) {
        psVar21 = psVar22 + 1;
        sVar12 = *psVar22;
        if (sVar12 == 0) goto LAB_00006bf2;
        if (sVar12 == -1) break;
        *piVar16 = iVar9;
        *(short *)(piVar16 + 1) = sVar12;
        *(short *)((int)piVar16 + 6) = sVar13;
        piVar16[0x81c14] = iVar9;
        *(short *)(piVar16 + 0x81c15) = sVar12;
        *(short *)((int)piVar16 + 0x207056) = sVar13;
        piVar16 = piVar16 + 2;
        iVar9 = iVar9 + 0x100000;
        psVar22 = psVar21;
      }
    } while( true );
  case '\x04':
    sVar13 = CONCAT11(uVar8,cVar4 << 1);
    if (cVar4 < '\0') {
      piVar16 = (int *)(&DAT_00708fb0 +
                       *(ushort *)(&DAT_0001efba + *(short *)(&DAT_0001efba + sVar13)));
      sVar13 = *(short *)(&DAT_0001efc0 + *(short *)(&DAT_0001efba + sVar13)) + -1;
      iVar9 = (uint)*(ushort *)(unaff_A5 + 0x2c2) << 0x10;
      do {
        *piVar16 = iVar9;
        *(undefined2 *)(piVar16 + 1) = 0;
        *(undefined2 *)((int)piVar16 + 6) = 0;
        piVar16[0x81c14] = iVar9;
        *(undefined2 *)(piVar16 + 0x81c15) = 0;
        *(undefined2 *)((int)piVar16 + 0x207056) = 0;
        piVar16 = piVar16 + 2;
        sVar13 = sVar13 + -1;
      } while (sVar13 != -1);
      FUN_00002ae8();
      return;
    }
    sVar12 = *(short *)(&DAT_0001efba + sVar13);
    sVar13 = *(short *)(&DAT_0001efbc + sVar12);
    sVar5 = CONCAT11((char)((ushort)*(undefined2 *)(&DAT_0001efbe + sVar12) >> 8),
                     ~(byte)*(undefined2 *)(&DAT_0001efbe + sVar12)) + 1;
    uVar11 = *(ushort *)(&DAT_0001efc0 + sVar12);
    if ((short)uVar11 < 0) {
      sVar12 = (uVar11 & 0xff) - 1;
      FUN_000c74cc();
      puVar14 = extraout_A0_00;
      puVar23 = extraout_A1_00;
      do {
        while( true ) {
          puVar24 = puVar23 + 1;
          uVar11 = *puVar23;
          if (uVar11 != 0) break;
          puVar23 = puVar23 + 2;
          unaff_A3 = unaff_A3 + 2;
        }
        puVar23 = puVar23 + 2;
        uVar10 = *puVar24;
        psVar21 = unaff_A3 + 1;
        sVar1 = *unaff_A3;
        unaff_A3 = unaff_A3 + 2;
        uVar6 = sVar5 + *psVar21;
        uVar7 = *(ushort *)(unaff_A5 + 0x2c2) | sVar13 + 0x40 + sVar1;
        *puVar14 = uVar7;
        puVar14[1] = uVar6;
        puVar14[2] = uVar11;
        puVar14[3] = uVar10;
        puVar14[0x103828] = uVar7;
        puVar14[0x103829] = uVar6;
        puVar14[0x10382a] = uVar11;
        puVar14[0x10382b] = uVar10;
        puVar14 = puVar14 + 4;
        sVar12 = sVar12 + -1;
      } while (sVar12 != -1);
      FUN_00002ae8();
      return;
    }
    sVar12 = uVar11 - 1;
    FUN_000c74cc();
    puVar14 = extraout_A0;
    puVar23 = extraout_A1;
    do {
      while( true ) {
        uVar11 = *puVar23;
        if (uVar11 != 0) break;
        unaff_A3 = unaff_A3 + 2;
        puVar23 = puVar23 + 1;
      }
      psVar21 = unaff_A3 + 1;
      sVar1 = *unaff_A3;
      unaff_A3 = unaff_A3 + 2;
      uVar10 = sVar5 + *psVar21;
      uVar6 = *(ushort *)(unaff_A5 + 0x2c2) | sVar13 + 0x40 + sVar1;
      *puVar14 = uVar6;
      puVar14[1] = uVar10;
      puVar14[2] = uVar11;
      puVar14[3] = extraout_D1w;
      puVar14[0x103828] = uVar6;
      puVar14[0x103829] = uVar10;
      puVar14[0x10382a] = uVar11;
      puVar14[0x10382b] = extraout_D1w;
      puVar14 = puVar14 + 4;
      sVar12 = sVar12 + -1;
      puVar23 = puVar23 + 1;
    } while (sVar12 != -1);
    FUN_00002ae8();
    return;
  }
  *(undefined2 *)(unaff_A5 + -0x759c) = 0xe000;
  sVar13 = CONCAT11(uVar8,cVar4 << 1);
  if (cVar4 < '\0') {
    pcVar20 = &DAT_0001aed2 + *(short *)(&DAT_0001aed0 + sVar13);
    piVar16 = (int *)(&DAT_00708fb0 +
                     *(ushort *)(&DAT_0001aed0 + *(short *)(&DAT_0001aed0 + sVar13)));
    do {
      iVar9 = (uint)*(ushort *)(unaff_A5 + 0x2c2) << 0x10;
      pcVar18 = pcVar20 + 3;
      while( true ) {
        pcVar20 = pcVar18 + 1;
        cVar4 = *pcVar18;
        if (cVar4 == '\0') goto LAB_00006bf2;
        if (cVar4 == '/') break;
        pcVar18 = pcVar20;
        if (cVar4 != ' ') {
          *piVar16 = iVar9;
          *(undefined2 *)(piVar16 + 1) = 0;
          *(undefined2 *)((int)piVar16 + 6) = 0;
          piVar16[0x81c14] = iVar9;
          *(undefined2 *)(piVar16 + 0x81c15) = 0;
          *(undefined2 *)((int)piVar16 + 0x207056) = 0;
          piVar16 = piVar16 + 2;
        }
      }
    } while( true );
  }
  pbVar19 = &DAT_0001aed2 + *(short *)(&DAT_0001aed0 + sVar13);
  piVar16 = (int *)(&DAT_00708fb0 + *(ushort *)(&DAT_0001aed0 + *(short *)(&DAT_0001aed0 + sVar13)))
  ;
LAB_00006c66:
  uVar11 = (ushort)*pbVar19 * 8 + 0x40;
  uVar10 = *(ushort *)(unaff_A5 + 0x2c2) | uVar11;
  if (*(short *)(unaff_A5 + -0x759c) != 0) {
    uVar10 = *(ushort *)(unaff_A5 + -0x759c) | *(ushort *)(unaff_A5 + 0x2c2) & 0x1fff | uVar11;
  }
  iVar9 = CONCAT22(uVar10,(ushort)pbVar19[1] * 2);
  bVar2 = pbVar19[2];
  pbVar17 = pbVar19 + 3;
  do {
    pbVar19 = pbVar17 + 1;
    bVar3 = *pbVar17;
    if (bVar3 == 0) {
LAB_00006bf2:
      *(undefined2 *)(unaff_A5 + -0x759c) = 0;
      FUN_00002ae8();
      return;
    }
    if (bVar3 == 0x2f) goto LAB_00006c66;
    if (bVar3 != 0x20) {
      *piVar16 = iVar9;
      *(ushort *)(piVar16 + 1) = bVar3 + 0x8000;
      *(ushort *)((int)piVar16 + 6) = (ushort)bVar2;
      piVar16[0x81c14] = iVar9;
      *(ushort *)(piVar16 + 0x81c15) = bVar3 + 0x8000;
      *(ushort *)((int)piVar16 + 0x207056) = (ushort)bVar2;
      piVar16 = piVar16 + 2;
    }
    iVar9 = iVar9 + 0x80000;
    pbVar17 = pbVar19;
  } while( true );
}



/* 00006416 FUN_00006416 */

void FUN_00006416(void)

{
  byte bVar1;
  undefined *puVar2;
  int unaff_A5;
  int unaff_A6;
  
  if (*(char *)(unaff_A5 + 0x2df) == '\0') {
    puVar2 = &DAT_00006470;
    if (*(char *)(unaff_A5 + 0x2e9) == '\0') {
      puVar2 = &DAT_00006474;
      if (*(char *)(unaff_A5 + 0x34a) == '\0') {
        return;
      }
      if (*(char *)(unaff_A5 + 0x34b) == '\0') {
        return;
      }
    }
    else if ((*(char *)(unaff_A5 + 0x34a) == '\0') || (*(char *)(unaff_A5 + 0x34b) != '\0')) {
      puVar2 = &DAT_0000646c;
    }
    bVar1 = *(char *)(unaff_A6 + 0x17) - 0xe;
    if (('\r' < *(char *)(unaff_A6 + 0x17)) && ((char)bVar1 < '\a')) {
      *(byte *)(unaff_A6 + 0x11) = *(byte *)(unaff_A6 + 0x11) & 0x80;
      *(byte *)(unaff_A6 + 0x11) = puVar2[(short)(ushort)(bVar1 >> 1)] | *(byte *)(unaff_A6 + 0x11);
    }
  }
  return;
}



/* 0000665c FUN_0000665c */

void FUN_0000665c(void)

{
  return;
}



/* 0000666e FUN_0000666e */

void FUN_0000666e(void)

{
  return;
}



/* 000066a8 FUN_000066a8 */

void FUN_000066a8(void)

{
  FUN_000066bc();
  FUN_000066bc();
  return;
}



/* 000066bc FUN_000066bc */

void FUN_000066bc(void)

{
  short sVar1;
  ushort in_D0w;
  char unaff_D2b;
  undefined2 unaff_D3w;
  undefined4 unaff_D5;
  undefined4 *in_A0;
  
  if ((unaff_D2b == '\0') && (in_D0w = in_D0w & 0xf, in_D0w == 0)) {
    return;
  }
  sVar1 = (in_D0w & 0xf) + 0x8000;
  *in_A0 = unaff_D5;
  *(short *)(in_A0 + 1) = sVar1;
  *(undefined2 *)((int)in_A0 + 6) = unaff_D3w;
  in_A0[0x81c14] = unaff_D5;
  *(short *)(in_A0 + 0x81c15) = sVar1;
  *(undefined2 *)((int)in_A0 + 0x207056) = unaff_D3w;
  FUN_00002ae8();
  return;
}



/* 00006710 FUN_00006710 */

void FUN_00006710(void)

{
  FUN_0000671a();
  FUN_00006732();
  FUN_00006732();
  return;
}



/* 0000671a FUN_0000671a */

void FUN_0000671a(void)

{
  FUN_00006732();
  FUN_00006732();
  return;
}



/* 00006732 FUN_00006732 */

void FUN_00006732(void)

{
  short sVar1;
  ushort in_D0w;
  char unaff_D2b;
  undefined2 unaff_D3w;
  undefined4 unaff_D5;
  undefined4 *in_A0;
  
  if ((unaff_D2b == '\0') && (in_D0w = in_D0w & 0xf, in_D0w == 0)) {
    return;
  }
  sVar1 = (in_D0w & 0xf) + 0x80b0;
  *in_A0 = unaff_D5;
  *(short *)(in_A0 + 1) = sVar1;
  *(undefined2 *)((int)in_A0 + 6) = unaff_D3w;
  in_A0[0x81c14] = unaff_D5;
  *(short *)(in_A0 + 0x81c15) = sVar1;
  *(undefined2 *)((int)in_A0 + 0x207056) = unaff_D3w;
  FUN_00002ae8();
  return;
}



/* 000067ca FUN_000067ca */

/* WARNING: Possible PIC construction at 0x000067d8: Changing call to branch */
/* WARNING: Removing unreachable block (ram,0x000067dc) */

void FUN_000067ca(void)

{
  byte extraout_var;
  undefined2 unaff_D3w;
  undefined4 unaff_D5;
  undefined4 *extraout_A0;
  int unaff_A5;
  
  FUN_0000665c();
  FUN_000067d4();
  *extraout_A0 = unaff_D5;
  *(ushort *)(extraout_A0 + 1) = extraout_var + 0x8080;
  *(undefined2 *)((int)extraout_A0 + 6) = unaff_D3w;
  extraout_A0[0x81c14] = unaff_D5;
  *(ushort *)(extraout_A0 + 0x81c15) = extraout_var + 0x8080;
  *(undefined2 *)((int)extraout_A0 + 0x207056) = unaff_D3w;
  *(undefined1 *)(unaff_A5 + 0x2c7) = 1;
  if (*(char *)(unaff_A5 + 0x2c8) == '\0') {
    *(ushort *)(unaff_A5 + 0x2c4) = *(ushort *)(unaff_A5 + 0x2c4) ^ 1;
    *(undefined1 *)(unaff_A5 + 0x2c8) = 1;
  }
  return;
}



/* 000067d4 FUN_000067d4 */

/* WARNING: Possible PIC construction at 0x000067d8: Changing call to branch */
/* WARNING: Removing unreachable block (ram,0x000067dc) */

void FUN_000067d4(void)

{
  short sVar1;
  ushort in_D0w;
  undefined2 unaff_D3w;
  undefined4 unaff_D5;
  undefined4 *in_A0;
  int unaff_A5;
  
  sVar1 = (in_D0w >> 8) + 0x8080;
  *in_A0 = unaff_D5;
  *(short *)(in_A0 + 1) = sVar1;
  *(undefined2 *)((int)in_A0 + 6) = unaff_D3w;
  in_A0[0x81c14] = unaff_D5;
  *(short *)(in_A0 + 0x81c15) = sVar1;
  *(undefined2 *)((int)in_A0 + 0x207056) = unaff_D3w;
  *(undefined1 *)(unaff_A5 + 0x2c7) = 1;
  if (*(char *)(unaff_A5 + 0x2c8) == '\0') {
    *(ushort *)(unaff_A5 + 0x2c4) = *(ushort *)(unaff_A5 + 0x2c4) ^ 1;
    *(undefined1 *)(unaff_A5 + 0x2c8) = 1;
  }
  return;
}



/* 0000693e FUN_0000693e */

void FUN_0000693e(void)

{
  char in_D1b;
  int iVar1;
  char *pcVar2;
  uint *puVar3;
  int unaff_A5;
  
  iVar1 = unaff_A5 + 0x44e;
  if (in_D1b != '\0') {
    iVar1 = unaff_A5 + 0x84e;
  }
  if ((*(byte *)(unaff_A5 + 0x2f0) & '\x01' << (*(byte *)(iVar1 + 0x381) & 7)) != 0) {
    pcVar2 = (char *)(iVar1 + 0x39d);
    *pcVar2 = *pcVar2 + DAT_00006abb;
    bcdAdjust(*pcVar2);
    pcVar2 = (char *)(iVar1 + 0x39c);
    *pcVar2 = *pcVar2 + DAT_00006aba;
    bcdAdjust(*pcVar2);
    pcVar2 = (char *)(iVar1 + 0x39b);
    *pcVar2 = *pcVar2 + DAT_00006ab9;
    bcdAdjust(*pcVar2);
    puVar3 = (uint *)(iVar1 + 0x39a);
    *(char *)puVar3 = *(char *)puVar3 + DAT_00006ab8;
    bcdAdjust(*(undefined1 *)puVar3);
    if (0x9999998 < *puVar3) {
      *puVar3 = 0x9999999;
    }
  }
  return;
}



/* 00006ba8 caseD_0 */

void switchD_000063b2::caseD_0(void)

{
  byte bVar1;
  byte bVar2;
  undefined2 in_D0w;
  short sVar3;
  ushort *puVar4;
  undefined2 *puVar5;
  byte *pbVar6;
  byte *pbVar7;
  
  sVar3 = CONCAT11((char)((ushort)in_D0w >> 8),(char)in_D0w << 1);
  if ((char)in_D0w < '\0') {
    pbVar6 = &DAT_0001aed2 + *(short *)(&DAT_0001aed0 + sVar3);
    do {
      puVar5 = (undefined2 *)((ushort)((ushort)pbVar6[1] + (ushort)*pbVar6 * 0x80) + 0x90c000);
      pbVar7 = pbVar6 + 3;
      while( true ) {
        pbVar6 = pbVar7 + 1;
        if (*pbVar7 == 0) {
          return;
        }
        if (*pbVar7 == 0x2f) break;
        *puVar5 = 0x20;
        puVar5[1] = 0;
        puVar5 = puVar5 + 0x40;
        pbVar7 = pbVar6;
      }
    } while( true );
  }
  pbVar6 = &DAT_0001aed2 + *(short *)(&DAT_0001aed0 + sVar3);
  do {
    puVar4 = (ushort *)((short)((ushort)pbVar6[1] + (ushort)*pbVar6 * 0x80) + 0x90c000);
    bVar1 = pbVar6[2];
    pbVar7 = pbVar6 + 3;
    while( true ) {
      pbVar6 = pbVar7 + 1;
      bVar2 = *pbVar7;
      if (bVar2 == 0) {
        return;
      }
      if (bVar2 == 0x2f) break;
      *puVar4 = (ushort)bVar2;
      puVar4[1] = (ushort)bVar1;
      puVar4 = puVar4 + 0x40;
      pbVar7 = pbVar6;
    }
  } while( true );
}



/* 00006e9c FUN_00006e9c */

void FUN_00006e9c(void)

{
  short sVar1;
  ushort uVar2;
  undefined4 in_D0;
  short sVar3;
  int iVar4;
  int *piVar5;
  short *psVar6;
  short *psVar7;
  int unaff_A5;
  
  *(undefined2 *)(unaff_A5 + -0x759c) = 0xe000;
  sVar3 = (short)CONCAT31((int3)((uint)in_D0 >> 8),(char)in_D0 << 1);
  if ((char)in_D0 < '\0') {
    psVar6 = (short *)(&DAT_0001c5e2 + *(short *)(&DAT_0001c5e0 + sVar3));
    piVar5 = (int *)(&DAT_00708fb0 + *(ushort *)(&DAT_0001c5e0 + *(short *)(&DAT_0001c5e0 + sVar3)))
    ;
    do {
      iVar4 = (uint)*(ushort *)(unaff_A5 + 0x2c2) << 0x10;
      psVar7 = psVar6 + 3;
      while( true ) {
        psVar6 = psVar7 + 1;
        if (*psVar7 == 0) goto LAB_00006bf2;
        if (*psVar7 == -1) break;
        *piVar5 = iVar4;
        *(undefined2 *)(piVar5 + 1) = 0;
        *(undefined2 *)((int)piVar5 + 6) = 0;
        piVar5[0x81c14] = iVar4;
        *(undefined2 *)(piVar5 + 0x81c15) = 0;
        *(undefined2 *)((int)piVar5 + 0x207056) = 0;
        piVar5 = piVar5 + 2;
        psVar7 = psVar6;
      }
    } while( true );
  }
  psVar6 = (short *)(&DAT_0001c5e2 + *(short *)(&DAT_0001c5e0 + sVar3));
  piVar5 = (int *)(&DAT_00708fb0 + *(ushort *)(&DAT_0001c5e0 + *(short *)(&DAT_0001c5e0 + sVar3)));
LAB_00006ec8:
  uVar2 = *(ushort *)(unaff_A5 + 0x2c2) | *psVar6 + 0x40U;
  if (*(short *)(unaff_A5 + -0x759c) != 0) {
    uVar2 = *(ushort *)(unaff_A5 + -0x759c) | uVar2 & 0x1fff;
  }
  iVar4 = CONCAT22(uVar2,(short)CONCAT31((int3)(CONCAT22(uVar2,psVar6[1]) >> 8),~(byte)psVar6[1]) +
                         1);
  sVar3 = psVar6[2];
  psVar7 = psVar6 + 3;
  do {
    psVar6 = psVar7 + 1;
    sVar1 = *psVar7;
    if (sVar1 == 0) {
LAB_00006bf2:
      *(undefined2 *)(unaff_A5 + -0x759c) = 0;
      FUN_00002ae8();
      return;
    }
    if (sVar1 == -1) goto LAB_00006ec8;
    *piVar5 = iVar4;
    *(short *)(piVar5 + 1) = sVar1;
    *(short *)((int)piVar5 + 6) = sVar3;
    piVar5[0x81c14] = iVar4;
    *(short *)(piVar5 + 0x81c15) = sVar1;
    *(short *)((int)piVar5 + 0x207056) = sVar3;
    piVar5 = piVar5 + 2;
    iVar4 = iVar4 + 0x100000;
    psVar7 = psVar6;
  } while( true );
}



/* 00007488 FUN_00007488 */

void FUN_00007488(void)

{
  short sVar1;
  int unaff_D5;
  int *extraout_A0;
  int *piVar2;
  short *extraout_A1;
  short *psVar3;
  
  FUN_0000665c();
  sVar1 = *extraout_A1;
  piVar2 = extraout_A0;
  psVar3 = extraout_A1;
  while (psVar3 = psVar3 + 1, *psVar3 != 0) {
    *piVar2 = unaff_D5;
    *(short *)(piVar2 + 1) = *psVar3;
    *(short *)((int)piVar2 + 6) = sVar1;
    piVar2[0x81c14] = unaff_D5;
    *(short *)(piVar2 + 0x81c15) = *psVar3;
    *(short *)((int)piVar2 + 0x207056) = sVar1;
    piVar2 = piVar2 + 2;
    unaff_D5 = unaff_D5 + 0x100000;
  }
  FUN_00002ae8();
  return;
}



/* 0000750a FUN_0000750a */

void FUN_0000750a(void)

{
  int unaff_A5;
  
  FUN_00007558();
  FUN_00007558();
  *(undefined2 *)(unaff_A5 + 0x2be) = 0;
  *(undefined2 *)(unaff_A5 + 0x2c0) = 0;
  FUN_000075e6();
  FUN_00007822();
  FUN_00007558();
  return;
}



/* 00007558 FUN_00007558 */

void FUN_00007558(void)

{
  short in_D0w;
  undefined2 in_D1w;
  undefined2 unaff_D2w;
  undefined2 *in_A0;
  undefined2 *puVar1;
  
  do {
    puVar1 = in_A0 + 1;
    *in_A0 = in_D1w;
    in_A0 = in_A0 + 2;
    *puVar1 = unaff_D2w;
    in_D0w = in_D0w + -1;
  } while (in_D0w != -1);
  return;
}



/* 000075e6 FUN_000075e6 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_000075e6(void)

{
  short sVar1;
  undefined4 *puVar2;
  undefined4 *puVar3;
  undefined4 *puVar4;
  undefined4 *puVar5;
  int unaff_A5;
  
  puVar2 = (undefined4 *)&DAT_00708fe8;
  puVar4 = (undefined4 *)&DAT_00910038;
  if (*(char *)(unaff_A5 + 0x7ce) != '\0') {
    puVar2 = (undefined4 *)&DAT_00708fb0;
    puVar4 = (undefined4 *)&DAT_00910000;
    sVar1 = 6;
    do {
      puVar3 = puVar2 + 1;
      *puVar2 = 0;
      puVar2 = puVar2 + 2;
      *puVar3 = 0;
      puVar3 = puVar4 + 1;
      *puVar4 = 0;
      puVar4 = puVar4 + 2;
      *puVar3 = 0;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
  }
  puVar3 = puVar2 + 0xe;
  puVar5 = puVar4 + 0xe;
  if (*(char *)(unaff_A5 + 0xbce) != '\0') {
    sVar1 = 6;
    puVar3 = puVar2;
    puVar5 = puVar4;
    do {
      puVar2 = puVar3 + 1;
      *puVar3 = 0;
      puVar3 = puVar3 + 2;
      *puVar2 = 0;
      puVar2 = puVar5 + 1;
      *puVar5 = 0;
      puVar5 = puVar5 + 2;
      *puVar2 = 0;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
  }
  sVar1 = 0xb9;
  do {
    puVar2 = puVar3 + 1;
    *puVar3 = 0;
    puVar3 = puVar3 + 2;
    *puVar2 = 0;
    puVar2 = puVar5 + 1;
    *puVar5 = 0;
    puVar5 = puVar5 + 2;
    *puVar2 = 0;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  puVar2 = (undefined4 *)&DAT_00708000;
  sVar1 = 0x1f5;
  do {
    puVar4 = puVar2 + 1;
    *puVar2 = 0;
    puVar2 = puVar2 + 2;
    *puVar4 = 0;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  _DAT_007095f2 = 0x8000;
  *(undefined1 *)(unaff_A5 + 0x2c6) = 1;
  FUN_00002ae8();
  return;
}



/* 00007708 FUN_00007708 */

void FUN_00007708(void)

{
  short in_D0w;
  undefined2 in_D1w;
  undefined2 unaff_D2w;
  undefined2 *in_A0;
  undefined2 *puVar1;
  
  do {
    *in_A0 = in_D1w;
    in_A0[1] = unaff_D2w;
    in_A0[2] = in_D1w;
    in_A0[3] = unaff_D2w;
    in_A0[4] = in_D1w;
    in_A0[5] = unaff_D2w;
    puVar1 = in_A0 + 7;
    in_A0[6] = in_D1w;
    in_A0 = in_A0 + 8;
    *puVar1 = unaff_D2w;
    in_D0w = in_D0w + -1;
  } while (in_D0w != -1);
  return;
}



/* 00007822 FUN_00007822 */

void FUN_00007822(void)

{
  FUN_00007708();
  FUN_00007708();
  FUN_00007708();
  FUN_00007708();
  return;
}



/* 000078fe FUN_000078fe */

void FUN_000078fe(void)

{
  short sVar1;
  
  sVar1 = 0x1b;
  do {
    FUN_00007938();
    FUN_00007938();
    FUN_00007938();
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00007938 FUN_00007938 */

void FUN_00007938(void)

{
  undefined2 in_D0w;
  undefined2 in_D1w;
  short unaff_D3w;
  undefined2 *in_A1;
  undefined2 *puVar1;
  
  do {
    puVar1 = in_A1 + 1;
    *in_A1 = in_D0w;
    in_A1 = in_A1 + 2;
    *puVar1 = in_D1w;
    unaff_D3w = unaff_D3w + -1;
  } while (unaff_D3w != -1);
  return;
}



/* 000079d2 FUN_000079d2 */

void FUN_000079d2(void)

{
  short sVar1;
  int unaff_A5;
  
  DAT_00619ffd = 0;
  if (*(char *)(unaff_A5 + 0x341) != '\0') {
    DAT_00619ffd = 0xff;
  }
  if ((*(short *)(unaff_A5 + -0x7584) != *(short *)(unaff_A5 + -0x7586)) && (DAT_0061801f == -1)) {
    sVar1 = *(short *)(unaff_A5 + -0x7584);
    DAT_00618007 = *(undefined1 *)(unaff_A5 + -0x7582 + (int)sVar1);
    DAT_00618009 = *(undefined1 *)(unaff_A5 + -0x7581 + (int)sVar1);
    DAT_00618001 = *(undefined1 *)(unaff_A5 + -0x7580 + (int)sVar1);
    DAT_00618003 = *(undefined1 *)(unaff_A5 + -0x757f + (int)sVar1);
    DAT_0061800d = *(undefined1 *)(unaff_A5 + -0x757d + (int)sVar1);
    DAT_0061800f = *(undefined1 *)(unaff_A5 + -0x757c + (int)sVar1);
    DAT_00618011 = *(undefined1 *)(unaff_A5 + -0x757b + (int)sVar1);
    DAT_00618017 = *(undefined1 *)(unaff_A5 + -0x757a + (int)sVar1);
    DAT_00618019 = *(undefined1 *)(unaff_A5 + -0x7579 + (int)sVar1);
    DAT_00618013 = *(undefined1 *)(unaff_A5 + -0x7578 + (int)sVar1);
    DAT_00618015 = *(undefined1 *)(unaff_A5 + -0x7577 + (int)sVar1);
    DAT_0061801f = '\0';
    *(ushort *)(unaff_A5 + -0x7584) = sVar1 + 0x10U & 0xff0;
  }
  return;
}



/* 00007a72 FUN_00007a72 */

void FUN_00007a72(void)

{
  short sVar1;
  undefined4 in_D1;
  undefined4 unaff_D2;
  undefined4 unaff_D3;
  int unaff_A5;
  
  if (((*(char *)(unaff_A5 + 0x2dd) != '\0') || (*(char *)(unaff_A5 + 0x317) != '\0')) ||
     (*(char *)(unaff_A5 + 0x2e6) == '\0')) {
    sVar1 = *(short *)(unaff_A5 + -0x7586);
    *(undefined4 *)(unaff_A5 + -0x7582 + (int)sVar1) = in_D1;
    *(undefined4 *)(unaff_A5 + -0x757e + (int)sVar1) = unaff_D2;
    *(undefined4 *)(unaff_A5 + -0x757a + (int)sVar1) = unaff_D3;
    *(ushort *)(unaff_A5 + -0x7586) = sVar1 + 0x10U & 0xff0;
  }
  return;
}



/* 00007a84 FUN_00007a84 */

void FUN_00007a84(void)

{
  short sVar1;
  undefined4 in_D1;
  undefined4 unaff_D2;
  undefined4 unaff_D3;
  int unaff_A5;
  
  sVar1 = *(short *)(unaff_A5 + -0x7586);
  *(undefined4 *)(unaff_A5 + -0x7582 + (int)sVar1) = in_D1;
  *(undefined4 *)(unaff_A5 + -0x757e + (int)sVar1) = unaff_D2;
  *(undefined4 *)(unaff_A5 + -0x757a + (int)sVar1) = unaff_D3;
  *(ushort *)(unaff_A5 + -0x7586) = sVar1 + 0x10U & 0xff0;
  return;
}



/* 00007ac8 FUN_00007ac8 */

void FUN_00007ac8(void)

{
  FUN_00007d24();
  FUN_00007b84();
  return;
}



/* 00007adc FUN_00007adc */

void FUN_00007adc(void)

{
  FUN_00007ac8();
  return;
}



/* 00007afc FUN_00007afc */

void FUN_00007afc(void)

{
  FUN_00007d24();
  FUN_00007b84();
  return;
}



/* 00007b1e FUN_00007b1e */

void FUN_00007b1e(void)

{
  FUN_00007d24();
  FUN_00007b84();
  return;
}



/* 00007b84 FUN_00007b84 */

void FUN_00007b84(void)

{
  FUN_00007a84();
  FUN_00007d3a();
  return;
}



/* 00007b90 FUN_00007b90 */

void FUN_00007b90(void)

{
  FUN_00007d24();
  FUN_00003288();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007bb0 FUN_00007bb0 */

void FUN_00007bb0(void)

{
  FUN_00007d24();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007c5a FUN_00007c5a */

void FUN_00007c5a(void)

{
  FUN_00007d24();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007c82 FUN_00007c82 */

void FUN_00007c82(void)

{
  FUN_00007d24();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007ca0 FUN_00007ca0 */

void FUN_00007ca0(void)

{
  FUN_00007d24();
  FUN_00003288();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007cba FUN_00007cba */

void FUN_00007cba(void)

{
  FUN_00007d24();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007cf2 FUN_00007cf2 */

void FUN_00007cf2(void)

{
  FUN_00007d24();
  FUN_00007a84();
  FUN_00007d3a();
  return;
}



/* 00007d0a FUN_00007d0a */

void FUN_00007d0a(void)

{
  FUN_00007b1e();
  FUN_00007afc();
  return;
}



/* 00007d12 FUN_00007d12 */

void FUN_00007d12(void)

{
  FUN_00007d24();
  FUN_00007a72();
  FUN_00007d3a();
  return;
}



/* 00007d24 FUN_00007d24 */

void FUN_00007d24(void)

{
  undefined4 in_D1;
  undefined4 unaff_D2;
  undefined4 unaff_D3;
  undefined4 unaff_D5;
  undefined4 unaff_A4;
  int unaff_A5;
  
  *(undefined4 *)(unaff_A5 + -0x758a) = unaff_A4;
  *(undefined4 *)(unaff_A5 + -0x758e) = unaff_D5;
  *(undefined4 *)(unaff_A5 + -0x759a) = in_D1;
  *(undefined4 *)(unaff_A5 + -0x7596) = unaff_D2;
  *(undefined4 *)(unaff_A5 + -0x7592) = unaff_D3;
  return;
}



/* 00007d3a FUN_00007d3a */

void FUN_00007d3a(void)

{
  return;
}



/* 000081d4 FUN_000081d4 */

void FUN_000081d4(void)

{
  undefined2 in_D0w;
  undefined2 in_D1w;
  undefined4 unaff_D2;
  undefined4 *in_A0;
  
  *in_A0 = unaff_D2;
  *(undefined2 *)(in_A0 + 1) = in_D0w;
  *(undefined2 *)((int)in_A0 + 6) = in_D1w;
  in_A0[0x81c14] = unaff_D2;
  *(undefined2 *)(in_A0 + 0x81c15) = in_D0w;
  *(undefined2 *)((int)in_A0 + 0x207056) = in_D1w;
  return;
}



/* 000084da FUN_000084da */

void FUN_000084da(void)

{
  int unaff_A5;
  
  *(undefined2 *)(unaff_A5 + -0x6580) = 2;
  *(undefined2 *)(unaff_A5 + -0x657e) = 0x30;
  *(int *)(unaff_A5 + -0x657c) = unaff_A5 + 0x3b2;
  if (*(char *)(unaff_A5 + 0x3be) == '\0') {
    FUN_000087dc();
    return;
  }
  return;
}



/* 000084f8 FUN_000084f8 */

void FUN_000084f8(void)

{
  int unaff_A5;
  
  *(undefined2 *)(unaff_A5 + -0x6580) = 2;
  *(undefined2 *)(unaff_A5 + -0x657e) = 0x32;
  *(int *)(unaff_A5 + -0x657c) = unaff_A5 + 0x3b6;
  if (*(char *)(unaff_A5 + 0x3be) == '\0') {
    FUN_000087dc();
    return;
  }
  return;
}



/* 000087dc FUN_000087dc */

void FUN_000087dc(void)

{
  ushort uVar1;
  short sVar2;
  short sVar3;
  ushort *extraout_A0;
  int unaff_A5;
  undefined1 uVar4;
  bool bVar5;
  
  *(undefined1 *)(unaff_A5 + 0x354) = 1;
  FUN_000088c8();
  bVar5 = false;
  FUN_00008908();
  FUN_000088f6();
  sVar3 = *(short *)(unaff_A5 + -0x6580) + -1;
  while( true ) {
    FUN_000088c8();
    FUN_000088f6();
    uVar4 = !bVar5;
    FUN_00008908();
    FUN_000088f6();
    FUN_00008892();
    if (!(bool)uVar4) break;
    FUN_000088c8();
    sVar2 = 0xf;
    uVar1 = *extraout_A0;
    do {
      bVar5 = CARRY2(uVar1,uVar1);
      FUN_00008908();
      uVar1 = FUN_000088f6();
      sVar2 = sVar2 + -1;
    } while (sVar2 != -1);
    uVar4 = !bVar5;
    FUN_00008908();
    FUN_000088f6();
    FUN_000088f6();
    FUN_00008892();
    if (!(bool)uVar4) break;
    FUN_00008908();
    sVar3 = sVar3 + -1;
    if (sVar3 == -1) {
      *(undefined1 *)(unaff_A5 + 0x354) = 0;
      return;
    }
  }
  *(undefined1 *)(unaff_A5 + 0x354) = 0;
  return;
}



/* 00008892 FUN_00008892 */

int6 FUN_00008892(void)

{
  undefined2 uVar1;
  ushort uVar2;
  int iVar3;
  int extraout_D1;
  
  uVar1 = FUN_00008908();
  iVar3 = 0x2ffff;
  do {
    if (iVar3 == 1) {
      return CONCAT24(uVar1,1);
    }
    FUN_000088f6();
    uVar1 = 0;
    iVar3 = extraout_D1;
  } while ((DAT_00804020 & 1) == 0);
  FUN_00008908();
  uVar2 = FUN_000088f6();
  return (uint6)uVar2 << 0x20;
}



/* 000088c8 FUN_000088c8 */

void FUN_000088c8(void)

{
  short sVar1;
  
  FUN_00008908();
  sVar1 = 9;
  do {
    FUN_00008908();
    FUN_000088f6();
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000088f6 FUN_000088f6 */

void FUN_000088f6(void)

{
  FUN_00008908();
  FUN_00008908();
  return;
}



/* 00008908 FUN_00008908 */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00008908(void)

{
  ushort unaff_D2w;
  int unaff_A5;
  
  _DAT_00804040 = *(ushort *)(unaff_A5 + 0x34c) | *(ushort *)(unaff_A5 + 0x34e) | unaff_D2w;
  if ((*(byte *)(unaff_A5 + 0x2e7) & 4) != 0) {
    _DAT_00804040 = _DAT_00804040 | 0x10;
  }
  if ((*(byte *)(unaff_A5 + 0x2e7) & 8) != 0) {
    _DAT_00804040 = _DAT_00804040 | 0x20;
  }
  if ((*(byte *)(unaff_A5 + 0x2e7) & 1) != 0) {
    _DAT_00804040 = _DAT_00804040 | 1;
  }
  if ((*(byte *)(unaff_A5 + 0x2e7) & 2) != 0) {
    _DAT_00804040 = _DAT_00804040 | 2;
  }
  return;
}



/* 000089e2 FUN_000089e2 */

void FUN_000089e2(void)

{
  short unaff_D3w;
  
  FUN_00008c9a();
  (*(code *)(&DAT_00008a1c + *(short *)(&DAT_00008a1c + (short)(unaff_D3w * 2))))();
  if (999999 < ((uint)DAT_00661021 << 0x18 | (uint)DAT_00661023 << 0x10 | (uint)DAT_00661025 << 8 |
               (uint)DAT_00661027)) {
    DAT_00661021 = 0;
    DAT_00661023 = 0;
    DAT_00661025 = 0;
    DAT_00661027 = 0;
    DAT_00662021 = 0;
    DAT_00662023 = 0;
    DAT_00662025 = 0;
    DAT_00662027 = 0;
    DAT_00663021 = 0;
    DAT_00663023 = 0;
    DAT_00663025 = 0;
    DAT_00663027 = 0;
  }
  return;
}



/* 00008a6e FUN_00008a6e */

void FUN_00008a6e(void)

{
  short unaff_D3w;
  
  FUN_00008c9a();
  (*(code *)(&DAT_00008aa8 + *(short *)(&DAT_00008aa8 + (short)(unaff_D3w * 2))))();
  if (999999 < ((uint)DAT_00661041 << 0x18 | (uint)DAT_00661043 << 0x10 | (uint)DAT_00661045 << 8 |
               (uint)DAT_00661047)) {
    DAT_00661041 = 0;
    DAT_00661043 = 0;
    DAT_00661045 = 0;
    DAT_00661047 = 0;
    DAT_00662041 = 0;
    DAT_00662043 = 0;
    DAT_00662045 = 0;
    DAT_00662047 = 0;
    DAT_00663041 = 0;
    DAT_00663043 = 0;
    DAT_00663045 = 0;
    DAT_00663047 = 0;
  }
  return;
}



/* 00008afa FUN_00008afa */

void FUN_00008afa(void)

{
  short unaff_D3w;
  
  FUN_00008c9a();
  (*(code *)(&DAT_00008b34 + *(short *)(&DAT_00008b34 + (short)(unaff_D3w * 2))))();
  if (999999 < ((uint)DAT_00661029 << 0x18 | (uint)DAT_0066102b << 0x10 | (uint)DAT_0066102d << 8 |
               (uint)DAT_0066102f)) {
    DAT_00661029 = 0;
    DAT_0066102b = 0;
    DAT_0066102d = 0;
    DAT_0066102f = 0;
    DAT_00662029 = 0;
    DAT_0066202b = 0;
    DAT_0066202d = 0;
    DAT_0066202f = 0;
    DAT_00663029 = 0;
    DAT_0066302b = 0;
    DAT_0066302d = 0;
    DAT_0066302f = 0;
  }
  return;
}



/* 00008b86 FUN_00008b86 */

void FUN_00008b86(void)

{
  short unaff_D3w;
  
  FUN_00008c9a();
  (*(code *)(&DAT_00008bbe + *(short *)(&DAT_00008bbe + (short)(unaff_D3w * 2))))();
  if (310000000 <
      ((uint)DAT_00661031 << 0x18 | (uint)DAT_00661033 << 0x10 | (uint)DAT_00661035 << 8 |
      (uint)DAT_00661037)) {
    DAT_00661031 = 0x12;
    DAT_00661033 = 0x7a;
    DAT_00661035 = 0x39;
    DAT_00661037 = 0x80;
    DAT_00662031 = 0x12;
    DAT_00662033 = 0x7a;
    DAT_00662035 = 0x39;
    DAT_00662037 = 0x80;
    DAT_00663031 = 0x12;
    DAT_00663033 = 0x7a;
    DAT_00663035 = 0x39;
    DAT_00663037 = 0x80;
  }
  return;
}



/* 00008c10 FUN_00008c10 */

void FUN_00008c10(void)

{
  short unaff_D3w;
  
  FUN_00008c9a();
  (*(code *)(&DAT_00008c48 + *(short *)(&DAT_00008c48 + (short)(unaff_D3w * 2))))();
  if (5200000 < ((uint)DAT_00661039 << 0x18 | (uint)DAT_0066103b << 0x10 | (uint)DAT_0066103d << 8 |
                (uint)DAT_0066103f)) {
    DAT_00661039 = 0;
    DAT_0066103b = 0x4f;
    DAT_0066103d = 0x58;
    DAT_0066103f = 0x80;
    DAT_00662039 = 0;
    DAT_0066203b = 0x4f;
    DAT_0066203d = 0x58;
    DAT_0066203f = 0x80;
    DAT_00663039 = 0;
    DAT_0066303b = 0x4f;
    DAT_0066303d = 0x58;
    DAT_0066303f = 0x80;
  }
  return;
}



/* 00008c9a FUN_00008c9a */

void FUN_00008c9a(void)

{
  byte bVar1;
  short unaff_D4w;
  undefined2 *in_A0;
  undefined2 *puVar2;
  undefined2 *puVar3;
  
  bVar1 = 0;
  puVar2 = in_A0 + 0x800;
  puVar3 = in_A0 + 0x1000;
  do {
    if ((char)*puVar2 != (char)*in_A0) {
      bVar1 = bVar1 | 1;
    }
    if ((char)*puVar3 != (char)*in_A0) {
      bVar1 = bVar1 | 2;
    }
    if ((char)*puVar3 != (char)*puVar2) {
      bVar1 = bVar1 | 4;
    }
  } while ((bVar1 != 7) &&
          (unaff_D4w = unaff_D4w + -1, in_A0 = in_A0 + 1, puVar2 = puVar2 + 1, puVar3 = puVar3 + 1,
          unaff_D4w != -1));
  return;
}



/* 00008cce FUN_00008cce */

void FUN_00008cce(void)

{
  int iVar1;
  int unaff_A5;
  
  iVar1 = ((uint)DAT_00661021 << 0x18 | (uint)DAT_00661023 << 0x10 | (uint)DAT_00661025 << 8 |
          (uint)DAT_00661027) + 1;
  DAT_00661021 = (byte)((uint)iVar1 >> 0x18);
  DAT_00661023 = (byte)((uint)iVar1 >> 0x10);
  DAT_00661025 = (byte)((uint)iVar1 >> 8);
  DAT_00661027 = (byte)iVar1;
  iVar1 = ((uint)DAT_00662021 << 0x18 | (uint)DAT_00662023 << 0x10 | (uint)DAT_00662025 << 8 |
          (uint)DAT_00662027) + 1;
  DAT_00662021 = (byte)((uint)iVar1 >> 0x18);
  DAT_00662023 = (byte)((uint)iVar1 >> 0x10);
  DAT_00662025 = (byte)((uint)iVar1 >> 8);
  DAT_00662027 = (byte)iVar1;
  iVar1 = ((uint)DAT_00663021 << 0x18 | (uint)DAT_00663023 << 0x10 | (uint)DAT_00663025 << 8 |
          (uint)DAT_00663027) + 1;
  DAT_00663021 = (byte)((uint)iVar1 >> 0x18);
  DAT_00663023 = (byte)((uint)iVar1 >> 0x10);
  DAT_00663025 = (byte)((uint)iVar1 >> 8);
  DAT_00663027 = (byte)iVar1;
  FUN_000089e2();
  *(uint *)(unaff_A5 + 0x390) =
       (uint)DAT_00661021 << 0x18 | (uint)DAT_00661023 << 0x10 | (uint)DAT_00661025 << 8 |
       (uint)DAT_00661027;
  return;
}



/* 00008d56 FUN_00008d56 */

void FUN_00008d56(void)

{
  int iVar1;
  int unaff_A5;
  
  iVar1 = ((uint)DAT_00661029 << 0x18 | (uint)DAT_0066102b << 0x10 | (uint)DAT_0066102d << 8 |
          (uint)DAT_0066102f) + 1;
  DAT_00661029 = (byte)((uint)iVar1 >> 0x18);
  DAT_0066102b = (byte)((uint)iVar1 >> 0x10);
  DAT_0066102d = (byte)((uint)iVar1 >> 8);
  DAT_0066102f = (byte)iVar1;
  iVar1 = ((uint)DAT_00662029 << 0x18 | (uint)DAT_0066202b << 0x10 | (uint)DAT_0066202d << 8 |
          (uint)DAT_0066202f) + 1;
  DAT_00662029 = (byte)((uint)iVar1 >> 0x18);
  DAT_0066202b = (byte)((uint)iVar1 >> 0x10);
  DAT_0066202d = (byte)((uint)iVar1 >> 8);
  DAT_0066202f = (byte)iVar1;
  iVar1 = ((uint)DAT_00663029 << 0x18 | (uint)DAT_0066302b << 0x10 | (uint)DAT_0066302d << 8 |
          (uint)DAT_0066302f) + 1;
  DAT_00663029 = (byte)((uint)iVar1 >> 0x18);
  DAT_0066302b = (byte)((uint)iVar1 >> 0x10);
  DAT_0066302d = (byte)((uint)iVar1 >> 8);
  DAT_0066302f = (byte)iVar1;
  FUN_00008afa();
  *(uint *)(unaff_A5 + 0x394) =
       (uint)DAT_00661029 << 0x18 | (uint)DAT_0066102b << 0x10 | (uint)DAT_0066102d << 8 |
       (uint)DAT_0066102f;
  return;
}



/* 00008d9a FUN_00008d9a */

void FUN_00008d9a(void)

{
  int iVar1;
  int unaff_A5;
  
  iVar1 = ((uint)DAT_00661031 << 0x18 | (uint)DAT_00661033 << 0x10 | (uint)DAT_00661035 << 8 |
          (uint)DAT_00661037) + 1;
  DAT_00661031 = (byte)((uint)iVar1 >> 0x18);
  DAT_00661033 = (byte)((uint)iVar1 >> 0x10);
  DAT_00661035 = (byte)((uint)iVar1 >> 8);
  DAT_00661037 = (byte)iVar1;
  iVar1 = ((uint)DAT_00662031 << 0x18 | (uint)DAT_00662033 << 0x10 | (uint)DAT_00662035 << 8 |
          (uint)DAT_00662037) + 1;
  DAT_00662031 = (byte)((uint)iVar1 >> 0x18);
  DAT_00662033 = (byte)((uint)iVar1 >> 0x10);
  DAT_00662035 = (byte)((uint)iVar1 >> 8);
  DAT_00662037 = (byte)iVar1;
  iVar1 = ((uint)DAT_00663031 << 0x18 | (uint)DAT_00663033 << 0x10 | (uint)DAT_00663035 << 8 |
          (uint)DAT_00663037) + 1;
  DAT_00663031 = (byte)((uint)iVar1 >> 0x18);
  DAT_00663033 = (byte)((uint)iVar1 >> 0x10);
  DAT_00663035 = (byte)((uint)iVar1 >> 8);
  DAT_00663037 = (byte)iVar1;
  FUN_00008b86();
  *(uint *)(unaff_A5 + 0x39c) =
       (uint)DAT_00661031 << 0x18 | (uint)DAT_00661033 << 0x10 | (uint)DAT_00661035 << 8 |
       (uint)DAT_00661037;
  return;
}



/* 00008dde FUN_00008dde */

void FUN_00008dde(void)

{
  int iVar1;
  int iVar2;
  int in_D0;
  int unaff_A5;
  
  *(int *)(unaff_A5 + -0x6476) = in_D0;
  iVar2 = in_D0 + ((uint)DAT_00661039 << 0x18 | (uint)DAT_0066103b << 0x10 | (uint)DAT_0066103d << 8
                  | (uint)DAT_0066103f);
  DAT_00661039 = (byte)((uint)iVar2 >> 0x18);
  DAT_0066103b = (byte)((uint)iVar2 >> 0x10);
  DAT_0066103d = (byte)((uint)iVar2 >> 8);
  DAT_0066103f = (byte)iVar2;
  iVar2 = in_D0 + ((uint)DAT_00662039 << 0x18 | (uint)DAT_0066203b << 0x10 | (uint)DAT_0066203d << 8
                  | (uint)DAT_0066203f);
  DAT_00662039 = (byte)((uint)iVar2 >> 0x18);
  DAT_0066203b = (byte)((uint)iVar2 >> 0x10);
  DAT_0066203d = (byte)((uint)iVar2 >> 8);
  DAT_0066203f = (byte)iVar2;
  iVar2 = in_D0 + ((uint)DAT_00663039 << 0x18 | (uint)DAT_0066303b << 0x10 | (uint)DAT_0066303d << 8
                  | (uint)DAT_0066303f);
  DAT_00663039 = (byte)((uint)iVar2 >> 0x18);
  DAT_0066303b = (byte)((uint)iVar2 >> 0x10);
  DAT_0066303d = (byte)((uint)iVar2 >> 8);
  DAT_0066303f = (byte)iVar2;
  FUN_00008c10();
  FUN_00008e28();
  iVar2 = *(int *)(unaff_A5 + -0x6476);
  if (*(char *)(unaff_A5 + 0x2df) == '\0') {
    return;
  }
  iVar1 = iVar2 + ((uint)DAT_00661041 << 0x18 | (uint)DAT_00661043 << 0x10 | (uint)DAT_00661045 << 8
                  | (uint)DAT_00661047);
  DAT_00661041 = (byte)((uint)iVar1 >> 0x18);
  DAT_00661043 = (byte)((uint)iVar1 >> 0x10);
  DAT_00661045 = (byte)((uint)iVar1 >> 8);
  DAT_00661047 = (byte)iVar1;
  iVar1 = iVar2 + ((uint)DAT_00662041 << 0x18 | (uint)DAT_00662043 << 0x10 | (uint)DAT_00662045 << 8
                  | (uint)DAT_00662047);
  DAT_00662041 = (byte)((uint)iVar1 >> 0x18);
  DAT_00662043 = (byte)((uint)iVar1 >> 0x10);
  DAT_00662045 = (byte)((uint)iVar1 >> 8);
  DAT_00662047 = (byte)iVar1;
  iVar2 = iVar2 + ((uint)DAT_00663041 << 0x18 | (uint)DAT_00663043 << 0x10 | (uint)DAT_00663045 << 8
                  | (uint)DAT_00663047);
  DAT_00663041 = (byte)((uint)iVar2 >> 0x18);
  DAT_00663043 = (byte)((uint)iVar2 >> 0x10);
  DAT_00663045 = (byte)((uint)iVar2 >> 8);
  DAT_00663047 = (byte)iVar2;
  FUN_00008a6e();
  *(uint *)(unaff_A5 + 0x3ac) =
       (uint)DAT_00661041 << 0x18 | (uint)DAT_00661043 << 0x10 | (uint)DAT_00661045 << 8 |
       (uint)DAT_00661047;
  return;
}



/* 00008e28 FUN_00008e28 */

void FUN_00008e28(void)

{
  int unaff_A5;
  
  *(uint *)(unaff_A5 + 0x3a0) =
       (uint)DAT_00661039 << 0x18 | (uint)DAT_0066103b << 0x10 | (uint)DAT_0066103d << 8 |
       (uint)DAT_0066103f;
  return;
}



/* 00008f5e FUN_00008f5e */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_00008f5e(void)

{
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + 0x38e) != '\0') && ((_DAT_00664000 & 1) == 0)) {
    _DAT_00664000 = _DAT_00664000 | 1;
  }
  return;
}



/* 00009360 FUN_00009360 */

void FUN_00009360(void)

{
  int unaff_A5;
  int unaff_A6;
  
  if ((*(char *)(unaff_A6 + 0x381) == '\0') && (*(char *)(unaff_A5 + 0xcb2) != '\0')) {
    return;
  }
  FUN_00006e9c();
  return;
}



/* 00009eaa FUN_00009eaa */

void FUN_00009eaa(void)

{
  int unaff_A5;
  int iVar1;
  
  if ((*(char *)(unaff_A5 + 0x2e3) != '\0') && ((*(byte *)(unaff_A5 + 0x92) & 1) != 0)) {
    FUN_000009d0();
    return;
  }
  if (*(char *)(unaff_A5 + 0x2ee) == '\0') {
    iVar1 = *(int *)(unaff_A5 + -0x7dfc);
    *(char *)(iVar1 + 0x1c) = *(char *)(iVar1 + 0x1c) + '\x01';
    if (*(char *)(iVar1 + 0x1c) != '\x04') {
      return;
    }
  }
  else {
    iVar1 = *(int *)(unaff_A5 + -0x7dfc);
  }
  *(undefined1 *)(iVar1 + 0x1c) = 0;
  FUN_000009d0();
  return;
}



/* 00009ee6 FUN_00009ee6 */

void FUN_00009ee6(void)

{
  undefined1 unaff_D2b;
  undefined2 *unaff_A5;
  bool bVar1;
  
  if (*(char *)((int)unaff_A5 + 0x349) == '\0') {
    if (*(char *)((int)unaff_A5 + 0x2df) != '\0') {
      FUN_0000aba2();
      return;
    }
    if (*(char *)((int)unaff_A5 + 0x2e9) == '\0') {
      return;
    }
    *unaff_A5 = 0;
    unaff_A5[1] = 0;
    unaff_A5[2] = 0;
    unaff_A5[3] = 0;
    unaff_A5[4] = 0;
    unaff_A5[5] = 0;
    unaff_A5[6] = 0;
    unaff_A5[7] = 0;
    unaff_A5[8] = 0;
    unaff_A5[9] = 0;
    unaff_A5[10] = 0;
    unaff_A5[0xb] = 0;
    FUN_00002c86();
    FUN_00000b2a();
    FUN_00007d0a();
    FUN_00000962();
    FUN_00000984();
    return;
  }
  bVar1 = *(char *)(unaff_A5 + 0x31b2) == '\0';
  if (bVar1) {
    FUN_0000a14e();
    if (bVar1) {
      *(undefined1 *)(unaff_A5 + 0x178) = unaff_D2b;
    }
    else {
      *(undefined1 *)(unaff_A5 + 0x178) = 0;
      if ((*(char *)(unaff_A5 + 0x31bb) == '\0') || (*(char *)((int)unaff_A5 + 0x6377) != '\x01')) {
        if (*(char *)((int)unaff_A5 + 0x363) != '\0') {
          return;
        }
        if ((*(char *)(unaff_A5 + 0x31bc) == '\0') || (*(char *)((int)unaff_A5 + 0x6379) != '\x01'))
        {
          if (*(char *)(unaff_A5 + 0x31bd) == '\0') {
            return;
          }
          if (*(char *)((int)unaff_A5 + 0x637b) != '\x01') {
            return;
          }
          *(undefined1 *)(unaff_A5 + 0x31bd) = 0;
        }
        else {
          *(undefined1 *)(unaff_A5 + 0x31bc) = 0;
        }
      }
      else {
        *(undefined1 *)(unaff_A5 + 0x31bb) = 0;
      }
    }
    FUN_00002944();
  }
  else {
    FUN_0000a14e();
    if (bVar1) {
      *(undefined1 *)(unaff_A5 + 0x178) = unaff_D2b;
    }
    else {
      *(undefined1 *)(unaff_A5 + 0x178) = 0;
      if ((*(char *)(unaff_A5 + 0x31bf) == '\0') || (*(char *)((int)unaff_A5 + 0x637f) != '\x01')) {
        return;
      }
      *(undefined1 *)(unaff_A5 + 0x31bf) = 0;
    }
    *(undefined1 *)((int)unaff_A5 + 0x637d) = 1;
    *(undefined1 *)(unaff_A5 + 0x31be) = 1;
  }
  FUN_000009a8();
  FUN_00002c86();
  FUN_00000b2a();
  *unaff_A5 = 0;
  unaff_A5[1] = 0;
  unaff_A5[2] = 0;
  unaff_A5[3] = 0;
  unaff_A5[4] = 0;
  unaff_A5[5] = 0;
  unaff_A5[6] = 0;
  unaff_A5[7] = 0;
  unaff_A5[8] = 0;
  unaff_A5[9] = 0;
  unaff_A5[10] = 0;
  unaff_A5[0xb] = 0;
  *(undefined1 *)((int)unaff_A5 + 0x2f7) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x2f9) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x317) = 0;
  *(undefined1 *)(unaff_A5 + 0x17c) = 0;
  *(undefined1 *)(unaff_A5 + 0x173) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x2e5) = 0;
  *(undefined1 *)(unaff_A5 + 0x175) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x38b) = 0;
  *(undefined1 *)(unaff_A5 + 0x1c5) = 0;
  *(undefined4 *)(unaff_A5 + 1000) = 0;
  *(undefined4 *)(unaff_A5 + 0x5e8) = 0;
  *(undefined1 *)(unaff_A5 + 999) = 2;
  *(undefined1 *)(unaff_A5 + 0x5e7) = 2;
  *(undefined1 *)((int)unaff_A5 + 0x7fd) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xbfd) = 0;
  *(undefined1 *)(unaff_A5 + 0x3ee) = 0;
  *(undefined1 *)(unaff_A5 + 0x5ee) = 0;
  *(undefined1 *)(unaff_A5 + 0x3fe) = 0;
  *(undefined1 *)(unaff_A5 + 0x5fe) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x7dd) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xbdd) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x7ff) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xbff) = 0;
  *(undefined1 *)(unaff_A5 + 0x402) = 0;
  *(undefined1 *)(unaff_A5 + 0x602) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x80b) = 0;
  *(undefined4 *)(unaff_A5 + 0x406) = 0;
  *(undefined1 *)(unaff_A5 + 0x408) = 0;
  *(undefined4 *)(unaff_A5 + 0x606) = 0;
  *(undefined1 *)(unaff_A5 + 0x608) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x811) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xc11) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xc0b) = 0;
  *(undefined1 *)((int)unaff_A5 + 1999) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xbcf) = 1;
  *(undefined1 *)((int)unaff_A5 + 0x805) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xc05) = 0;
  unaff_A5[0x3f6] = (short)unaff_A5 + 0x84e;
  unaff_A5[0x5f6] = (short)unaff_A5 + 0x44e;
  *(undefined1 *)((int)unaff_A5 + 0x7df) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xbdf) = 0;
  *(undefined1 *)((int)unaff_A5 + 0x7f1) = 0xff;
  *(undefined1 *)((int)unaff_A5 + 0xbf1) = 0xff;
  *(undefined1 *)((int)unaff_A5 + 0x7f3) = 0;
  *(undefined1 *)((int)unaff_A5 + 0xbf3) = 0;
  *(char *)(unaff_A5 + 0x401) = *(char *)(unaff_A5 + 0x31b2) * '\x02';
  *(char *)(unaff_A5 + 0x601) = *(char *)(unaff_A5 + 0x31b2) * '\x02' + '\x01';
  if ((*(byte *)(unaff_A5 + 0x178) & 1) != 0) {
    *(undefined1 *)(unaff_A5 + 1000) = 4;
    *(undefined1 *)(unaff_A5 + 0x3ee) = 1;
  }
  if ((*(byte *)(unaff_A5 + 0x178) & 2) != 0) {
    *(undefined1 *)(unaff_A5 + 0x5e8) = 4;
    *(undefined1 *)(unaff_A5 + 0x5ee) = 1;
  }
  FUN_00002bd6();
  FUN_00000962();
  FUN_00000984();
  return;
}



/* 0000a14e FUN_0000a14e */

void FUN_0000a14e(void)

{
  char cVar1;
  uint uVar2;
  uint extraout_D1;
  byte bVar3;
  byte bVar4;
  byte *pbVar5;
  int unaff_A5;
  bool bVar6;
  
  bVar3 = *(byte *)(unaff_A5 + 0x7e) & ~*(byte *)(unaff_A5 + 0x7f);
  uVar2 = bVar3 & 0xffffff30;
  if ((bVar3 & 0x30) == 0) {
    return;
  }
  if (*(char *)(unaff_A5 + 0x34a) == '\0') {
    pbVar5 = (byte *)(unaff_A5 + 0x2e9);
    cVar1 = '\x02';
    if (((char)uVar2 != '0') && (cVar1 = '\x01', (bVar3 & 0x20) == 0)) {
      FUN_0000a1bc();
      return;
    }
  }
  else {
    if ((char)uVar2 == '0') {
      bVar6 = false;
      FUN_0000a1bc();
      uVar2 = extraout_D1;
      if (bVar6) {
        FUN_0000a1bc();
        return;
      }
    }
    cVar1 = '\x01';
    pbVar5 = (byte *)(unaff_A5 + 0x34b);
    if ((uVar2 & 0x20) == 0) {
      cVar1 = '\x01';
      pbVar5 = (byte *)(unaff_A5 + 0x2e9);
    }
  }
  if (*(char *)(unaff_A5 + 0x2df) == '\0') {
    bVar3 = (*(char *)(unaff_A5 + 0x2e0) + '\x01') * cVar1;
    bVar4 = bcdAdjust(*pbVar5 - bVar3);
    if (*pbVar5 < bVar3) {
      return;
    }
    *pbVar5 = bVar4;
  }
  return;
}



/* 0000a1bc FUN_0000a1bc */

void FUN_0000a1bc(void)

{
  char in_D0b;
  byte bVar1;
  byte bVar2;
  byte *in_A1;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x2df) == '\0') {
    bVar1 = (*(char *)(unaff_A5 + 0x2e0) + '\x01') * in_D0b;
    bVar2 = bcdAdjust(*in_A1 - bVar1);
    if (*in_A1 < bVar1) {
      return;
    }
    *in_A1 = bVar2;
  }
  return;
}



/* 0000a728 FUN_0000a728 */

void FUN_0000a728(void)

{
  undefined1 in_D0b;
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + 0x2f2) = 0;
  *(undefined1 *)(unaff_A5 + 0xdde) = 0;
  *(undefined1 *)(unaff_A5 + 0x7df) = in_D0b;
  *(undefined1 *)(unaff_A5 + 0x44e) = 1;
  *(undefined1 *)(unaff_A5 + 0x44f) = 1;
  *(undefined1 *)(unaff_A5 + 0x460) = 1;
  *(undefined1 *)(unaff_A5 + 0x60c) = 1;
  *(undefined1 *)(unaff_A5 + 0x7dc) = 0;
  *(undefined1 *)(unaff_A5 + 1999) = 0;
  *(undefined1 *)(unaff_A5 + 0x7ff) = 0;
  *(undefined1 *)(unaff_A5 + 0x804) = 0;
  *(undefined4 *)(unaff_A5 + 0x80c) = 0;
  *(undefined1 *)(unaff_A5 + 0x80b) = 0;
  *(undefined2 *)(unaff_A5 + 0x454) = 0x280;
  *(undefined2 *)(unaff_A5 + 0x458) = 0x28;
  *(undefined1 *)(unaff_A5 + 0x5f1) = 6;
  if (*(char *)(unaff_A5 + 0x7df) == '\v') {
    *(undefined **)(unaff_A5 + 0x602) = &DAT_000b8eec;
    *(undefined1 *)(unaff_A5 + 0x59a) = 1;
  }
  FUN_00005256();
  FUN_000bfa78();
  return;
}



/* 0000aa66 FUN_0000aa66 */

void FUN_0000aa66(void)

{
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x2e0) == '\0') {
    if (*(char *)(unaff_A5 + 0x2e9) != *(char *)(unaff_A5 + 0x2ea)) {
      *(char *)(unaff_A5 + 0x2ea) = *(char *)(unaff_A5 + 0x2e9);
      if ((*(byte *)(unaff_A5 + 0x2e9) < 2) && (*(char *)(unaff_A5 + 0x344) == '\0')) {
        FUN_00002ca4();
        return;
      }
      FUN_00002ca4();
      return;
    }
  }
  else if (*(char *)(unaff_A5 + 0x2e9) != *(char *)(unaff_A5 + 0x2ea)) {
    *(char *)(unaff_A5 + 0x2ea) = *(char *)(unaff_A5 + 0x2e9);
    if (3 < *(byte *)(unaff_A5 + 0x2e9)) {
      FUN_00002ca4();
      return;
    }
    if (*(char *)(unaff_A5 + 0x344) != '\0') {
      FUN_00002ca4();
      return;
    }
    FUN_00002ca4();
    return;
  }
  return;
}



/* 0000ab7e FUN_0000ab7e */

void FUN_0000ab7e(void)

{
  char in_D0b;
  byte bVar1;
  byte bVar2;
  byte *in_A1;
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x2df) == '\0') {
    bVar1 = (*(char *)(unaff_A5 + 0x2e0) + '\x01') * in_D0b;
    bVar2 = bcdAdjust(*in_A1 - bVar1);
    if (*in_A1 < bVar1) {
      return;
    }
    *in_A1 = bVar2;
  }
  return;
}



/* 0000aba2 FUN_0000aba2 */

void FUN_0000aba2(void)

{
  byte bVar1;
  uint uVar2;
  uint extraout_D1;
  undefined1 uVar3;
  undefined2 *unaff_A5;
  bool bVar4;
  
  bVar1 = *(byte *)(unaff_A5 + 0x3f) & ~*(byte *)((int)unaff_A5 + 0x7f);
  uVar2 = bVar1 & 0xffff0030;
  if ((bVar1 & 0x30) != 0) {
    if (*(char *)(unaff_A5 + 0x1a2) == '\0') {
      if ((bVar1 & 0x20) != 0) {
        uVar3 = 3;
        bVar4 = false;
        FUN_0000ab7e();
        uVar2 = extraout_D1;
        if (bVar4) goto LAB_0000abfa;
      }
      if ((uVar2 & 0x10) != 0) {
        uVar3 = 1;
        bVar4 = false;
        FUN_0000ab7e();
        if (!bVar4) {
          return;
        }
LAB_0000abfa:
        *(undefined1 *)(unaff_A5 + 0x178) = uVar3;
        FUN_000009a8();
        FUN_00002c86();
        FUN_00000b2a();
        *unaff_A5 = 0;
        unaff_A5[1] = 0;
        unaff_A5[2] = 0;
        unaff_A5[3] = 0;
        unaff_A5[4] = 0;
        unaff_A5[5] = 0;
        unaff_A5[6] = 0;
        unaff_A5[7] = 0;
        unaff_A5[8] = 0;
        unaff_A5[9] = 0;
        unaff_A5[10] = 0;
        unaff_A5[0xb] = 0;
        *(undefined1 *)((int)unaff_A5 + 0x2f7) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x2f9) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x317) = 0;
        *(undefined1 *)(unaff_A5 + 0x17c) = 0;
        *(undefined1 *)(unaff_A5 + 0x173) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x2e5) = 0;
        *(undefined1 *)(unaff_A5 + 0x175) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x2f1) = 1;
        *(undefined4 *)(unaff_A5 + 1000) = 0;
        *(undefined4 *)(unaff_A5 + 0x5e8) = 0;
        *(undefined1 *)(unaff_A5 + 999) = 0;
        *(undefined1 *)(unaff_A5 + 0x5e7) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x7fd) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xbfd) = 0;
        *(undefined1 *)(unaff_A5 + 0x3ee) = 0;
        *(undefined1 *)(unaff_A5 + 0x5ee) = 0;
        *(undefined1 *)(unaff_A5 + 0x3fe) = 0;
        *(undefined1 *)(unaff_A5 + 0x5fe) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x7dd) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xbdd) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x7ff) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xbff) = 0;
        *(undefined1 *)(unaff_A5 + 0x402) = 0;
        *(undefined1 *)(unaff_A5 + 0x602) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x80b) = 0;
        *(undefined4 *)(unaff_A5 + 0x406) = 0;
        *(undefined1 *)(unaff_A5 + 0x408) = 0;
        *(undefined4 *)(unaff_A5 + 0x606) = 0;
        *(undefined1 *)(unaff_A5 + 0x608) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xc0b) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x811) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xc11) = 0;
        *(undefined1 *)((int)unaff_A5 + 1999) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xbcf) = 1;
        unaff_A5[0x3f6] = (short)unaff_A5 + 0x84e;
        unaff_A5[0x5f6] = (short)unaff_A5 + 0x44e;
        *(undefined1 *)((int)unaff_A5 + 0x7df) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xbdf) = 0;
        *(undefined1 *)((int)unaff_A5 + 0x7f1) = 0xff;
        *(undefined1 *)((int)unaff_A5 + 0xbf1) = 0xff;
        *(undefined1 *)((int)unaff_A5 + 0x7f3) = 0;
        *(undefined1 *)((int)unaff_A5 + 0xbf3) = 0;
        if ((*(byte *)(unaff_A5 + 0x178) & 1) != 0) {
          FUN_0000ad60();
        }
        if ((*(byte *)(unaff_A5 + 0x178) & 2) != 0) {
          FUN_0000ad4c();
        }
        FUN_00002bd6();
        if (*(char *)(unaff_A5 + 0x1c7) != '\0') {
          FUN_00008dde();
        }
        FUN_00000962();
        FUN_00000962();
        FUN_00000984();
        return;
      }
    }
    else {
      uVar3 = 3;
      bVar4 = (char)uVar2 == '0';
      if (!bVar4) {
        uVar3 = 2;
        bVar4 = false;
        if ((bVar1 & 0x20) == 0) {
          uVar3 = 1;
          bVar4 = false;
        }
      }
      FUN_0000ab7e();
      if (bVar4) goto LAB_0000abfa;
    }
  }
  return;
}



/* 0000ad4c FUN_0000ad4c */

void FUN_0000ad4c(void)

{
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + 0xbce) = 2;
  *(undefined1 *)(unaff_A5 + 0xbd0) = 4;
  *(undefined1 *)(unaff_A5 + 0xbdc) = 1;
  return;
}



/* 0000ad60 FUN_0000ad60 */

void FUN_0000ad60(void)

{
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + 0x7ce) = 2;
  *(undefined1 *)(unaff_A5 + 2000) = 4;
  *(undefined1 *)(unaff_A5 + 0x7dc) = 1;
  return;
}



/* 0000b92a FUN_0000b92a */

void FUN_0000b92a(void)

{
  short sVar1;
  uint *in_A0;
  uint *in_A1;
  
  sVar1 = 7;
  do {
    *in_A0 = *in_A1 | *in_A0 & 0xf000f000;
    sVar1 = sVar1 + -1;
    in_A0 = in_A0 + 1;
    in_A1 = in_A1 + 1;
  } while (sVar1 != -1);
  return;
}



/* 0000f100 FUN_0000f100 */

void FUN_0000f100(void)

{
  int unaff_A4;
  
  if (*(char *)(unaff_A4 + 0x381) != '\0') {
    FUN_00007c82();
    return;
  }
  FUN_00007c5a();
  return;
}



/* 00010026 FUN_00010026 */

void FUN_00010026(void)

{
  undefined4 unaff_D5;
  undefined4 *extraout_A0;
  
  FUN_0000666e();
  *extraout_A0 = unaff_D5;
  *(undefined2 *)(extraout_A0 + 1) = 0x815f;
  *(undefined2 *)((int)extraout_A0 + 6) = 0xd;
  extraout_A0[0x81c14] = unaff_D5;
  *(undefined2 *)(extraout_A0 + 0x81c15) = 0x815f;
  *(undefined2 *)((int)extraout_A0 + 0x207056) = 0xd;
  FUN_00002ae8();
  return;
}



/* 00010efc FUN_00010efc */

void FUN_00010efc(void)

{
  return;
}



/* 000114fc FUN_000114fc */

void FUN_000114fc(void)

{
  FUN_00002822();
  FUN_00002822();
  return;
}



/* 00012298 FUN_00012298 */

void FUN_00012298(void)

{
  int unaff_A4;
  int unaff_A5;
  bool bVar1;
  
  if (((&DAT_000061da)[unaff_A5] == '\0') && (*(char *)(unaff_A4 + 0x38f) == '\0')) {
    FUN_00012c36();
    if ((&DAT_000061d4)[unaff_A5] == '\0') {
      *(undefined1 *)(unaff_A4 + 0x81) = 1;
      bVar1 = false;
      if (*(char *)(unaff_A5 + 0x2e6) == '\0') {
        *(undefined1 *)(unaff_A4 + 0x81) = 0;
        bVar1 = (&DAT_000061d9)[unaff_A5] == '\0';
        if (!bVar1) {
          (&DAT_000061d9)[unaff_A5] = (&DAT_000061d9)[unaff_A5] + -1;
          *(undefined1 *)(unaff_A4 + 0x81) = 1;
          bVar1 = false;
        }
      }
      FUN_000122f4();
      if (bVar1) goto LAB_000122e6;
    }
    *(undefined1 *)(unaff_A4 + 0x38f) = 1;
    FUN_00012d3a();
  }
LAB_000122e6:
  FUN_0003bfb2();
  return;
}



/* 000122f4 FUN_000122f4 */

undefined4 FUN_000122f4(void)

{
  byte bVar1;
  int unaff_A4;
  int unaff_A5;
  
  if (*(char *)(unaff_A4 + 0x81) == '\0') {
    bVar1 = 0x10;
    if (*(char *)(unaff_A4 + 0x381) != '\0') {
      bVar1 = 0x20;
    }
    if ((bVar1 & *(byte *)(unaff_A5 + 0x7e) & ~*(byte *)(unaff_A5 + 0x7f)) != 0) {
      return 1;
    }
  }
  if ((*(ushort *)(unaff_A4 + 0x392) & ~*(ushort *)(unaff_A4 + 0x394) & 0x770) != 0) {
    return 1;
  }
  return 0;
}



/* 00012c36 FUN_00012c36 */

void FUN_00012c36(void)

{
  int unaff_A4;
  
  if (*(char *)(unaff_A4 + 0x82) == '\0') {
    FUN_00012c56();
    FUN_00012c8e();
    FUN_00012cf0();
    FUN_00012c62();
    return;
  }
  return;
}



/* 00012c56 FUN_00012c56 */

void FUN_00012c56(void)

{
  return;
}



/* 00012c62 FUN_00012c62 */

void FUN_00012c62(void)

{
  ushort unaff_D3w;
  int unaff_A4;
  
  *(undefined *)(unaff_A4 + 0x391) = (&DAT_00012c7e)[(short)(unaff_D3w & 0xff)];
  return;
}



/* 00012c8e FUN_00012c8e */

void FUN_00012c8e(void)

{
  char unaff_D3b;
  uint unaff_D6;
  
  if ((unaff_D6 & 1) != 0) {
    if (unaff_D3b == '\x03') {
      return;
    }
    if (unaff_D3b != '\t') {
      if (unaff_D3b != '\x0f') {
        return;
      }
      return;
    }
    return;
  }
  if ((unaff_D6 & 2) == 0) {
    return;
  }
  if (unaff_D3b != '\0') {
    if (unaff_D3b == '\x04') {
      return;
    }
    if (unaff_D3b != '\n') {
      return;
    }
    return;
  }
  return;
}



/* 00012cf0 FUN_00012cf0 */

void FUN_00012cf0(void)

{
  byte unaff_D3b;
  uint unaff_D6;
  
  if ((unaff_D6 & 8) == 0) {
    if ((unaff_D6 & 4) == 0) {
      return;
    }
    if (unaff_D3b < 10) {
      return;
    }
  }
  return;
}



/* 00012d3a FUN_00012d3a */

void FUN_00012d3a(void)

{
  int unaff_A4;
  
  if (*(char *)(unaff_A4 + 0x381) != '\0') {
    FUN_00007c82();
    return;
  }
  FUN_00007c5a();
  return;
}



/* 00014738 FUN_00014738 */

void FUN_00014738(void)

{
  int unaff_A4;
  
  if (*(char *)(unaff_A4 + 0x381) != '\0') {
    FUN_00007c82();
    return;
  }
  FUN_00007c5a();
  return;
}



/* 0001676f FUN_0001676f */

/* WARNING: Control flow encountered bad instruction data */

void FUN_0001676f(void)

{
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}



/* 0002822a FUN_0002822a */

void FUN_0002822a(void)

{
  short sVar1;
  int unaff_A5;
  char *pcVar2;
  
  FUN_000018ec();
  pcVar2 = (char *)(unaff_A5 + 0x29a2);
  sVar1 = 0x3b;
  do {
    if (*pcVar2 != '\0') {
      (**(code **)(&DAT_00028286 + (short)((ushort)(byte)pcVar2[0x20] << 2)))();
    }
    pcVar2 = pcVar2 + 0xc0;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00031c08 FUN_00031c08 */

void FUN_00031c08(void)

{
  char in_D1b;
  short unaff_D2w;
  short sVar1;
  ushort unaff_D3w;
  uint *puVar2;
  uint *puVar3;
  
  puVar2 = (uint *)0x900800;
  if (in_D1b == '\0') {
    puVar2 = (uint *)&DAT_00900a00;
  }
  if ((byte)unaff_D2w < 10) {
    puVar3 = (uint *)((uint)unaff_D3w * 0x500 + (short)(unaff_D2w << 7) + 0x31c48);
  }
  else {
    puVar3 = &DAT_00036c48;
  }
  sVar1 = 0x3f;
  do {
    *puVar2 = *puVar3 | *puVar2 & 0xf000f000;
    sVar1 = sVar1 + -1;
    puVar2 = puVar2 + 1;
    puVar3 = puVar3 + 1;
  } while (sVar1 != -1);
  return;
}



/* 0003bd7e FUN_0003bd7e */

void FUN_0003bd7e(void)

{
  FUN_00007488();
  return;
}



/* 0003bd9a FUN_0003bd9a */

void FUN_0003bd9a(void)

{
  FUN_00007488();
  return;
}



/* 0003bfb2 FUN_0003bfb2 */

undefined4 FUN_0003bfb2(void)

{
  short sVar1;
  short in_D0w;
  undefined4 uVar2;
  short extraout_D1w;
  short sVar3;
  char unaff_D3b;
  short sVar4;
  int iVar5;
  int iVar6;
  uint *puVar7;
  short *psVar8;
  short *extraout_A0;
  int *piVar9;
  short *psVar10;
  short *psVar11;
  undefined *puVar12;
  short *psVar13;
  uint *puVar14;
  short *psVar15;
  int unaff_A5;
  
  if (in_D0w != 0) {
    if (*(byte *)(unaff_A5 + 0xbff) < 10) {
      FUN_0003bd7e();
    }
    else {
      FUN_0003bd9a();
    }
    FUN_00005444();
    FUN_00031c08();
    if (9 < *(byte *)(unaff_A5 + 0xbff)) {
      uVar2 = FUN_00005756();
      return uVar2;
    }
    uVar2 = FUN_000056e2();
    return uVar2;
  }
  if (*(byte *)(unaff_A5 + 0x7ff) < 10) {
    FUN_0003bd7e();
  }
  else {
    FUN_0003bd9a();
  }
  FUN_00005444();
  FUN_00031c08();
  if (*(byte *)(unaff_A5 + 0x7ff) < 10) {
    puVar12 = &DAT_0003e94a;
    if ((char)extraout_D1w == '\0') {
      puVar12 = &DAT_0003e96a;
    }
    psVar11 = (short *)(puVar12 + *(short *)(puVar12 + (short)(unaff_D3b * 2)));
  }
  else {
    psVar11 = &DAT_0003e98a;
    if ((char)extraout_D1w == '\0') {
      psVar11 = &DAT_0003ea54;
    }
  }
  sVar3 = *psVar11;
  sVar1 = psVar11[1];
  psVar11 = psVar11 + 3;
  if (9 < *(byte *)(unaff_A5 + 0x7ff)) {
    if (extraout_D1w != 0) {
      piVar9 = (int *)((int)psVar11 + (int)(short)(sVar1 * sVar3 * 4));
      sVar3 = sVar3 + -1;
      sVar1 = sVar1 + -1;
      puVar14 = (uint *)((int)extraout_A0 + (short)(sVar1 * 4) + 4);
      sVar4 = sVar1;
      puVar7 = puVar14;
      do {
        do {
          piVar9 = piVar9 + -1;
          puVar14 = puVar14 + -1;
          *puVar14 = *piVar9 + 0x20000000U ^ 0x20;
          sVar4 = sVar4 + -1;
        } while (sVar4 != -1);
        puVar14 = puVar7 + 0x10;
        sVar3 = sVar3 + -1;
        sVar4 = sVar1;
        puVar7 = puVar14;
      } while (sVar3 != -1);
      return 0;
    }
    sVar3 = sVar3 + -1;
    sVar4 = sVar1 + -1;
    psVar13 = extraout_A0;
    psVar8 = extraout_A0;
    do {
      do {
        psVar10 = psVar11 + 1;
        psVar15 = psVar13 + 1;
        *psVar13 = *psVar11 + 0x2000;
        psVar11 = psVar11 + 2;
        psVar13 = psVar13 + 2;
        *psVar15 = *psVar10;
        sVar4 = sVar4 + -1;
      } while (sVar4 != -1);
      psVar13 = psVar8 + 0x20;
      sVar3 = sVar3 + -1;
      sVar4 = sVar1 + -1;
      psVar8 = psVar13;
    } while (sVar3 != -1);
    return 0;
  }
  if (extraout_D1w == 0) {
    sVar3 = sVar3 + -1;
    sVar4 = sVar1 + -1;
    psVar13 = extraout_A0;
    psVar8 = extraout_A0;
    do {
      do {
        if (-1 < *psVar11) {
          *psVar13 = *psVar11 + 0x2000;
          psVar13[1] = psVar11[1];
        }
        psVar11 = psVar11 + 2;
        psVar13 = psVar13 + 2;
        sVar4 = sVar4 + -1;
      } while (sVar4 != -1);
      psVar13 = psVar8 + 0x20;
      sVar3 = sVar3 + -1;
      sVar4 = sVar1 + -1;
      psVar8 = psVar13;
    } while (sVar3 != -1);
    return 0;
  }
  piVar9 = (int *)((int)psVar11 + (int)(short)(sVar1 * sVar3 * 4));
  sVar3 = sVar3 + -1;
  sVar1 = sVar1 + -1;
  iVar6 = (int)extraout_A0 + (short)(sVar1 * 4) + 4;
  sVar4 = sVar1;
  iVar5 = iVar6;
  do {
    do {
      piVar9 = piVar9 + -1;
      if (-1 < *piVar9) {
        *(uint *)(iVar6 + -4) = *piVar9 + 0x20000000U ^ 0x20;
      }
      iVar6 = iVar6 + -4;
      sVar4 = sVar4 + -1;
    } while (sVar4 != -1);
    iVar6 = iVar5 + 0x40;
    sVar3 = sVar3 + -1;
    sVar4 = sVar1;
    iVar5 = iVar6;
  } while (sVar3 != -1);
  return 0;
}



/* 0003c200 FUN_0003c200 */

void FUN_0003c200(void)

{
  FUN_00005444();
  FUN_0003c2ba();
  FUN_00005444();
  FUN_0003c2ba();
  return;
}



/* 0003c2ba FUN_0003c2ba */

void FUN_0003c2ba(void)

{
  undefined1 unaff_D2b;
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + -0x5dd8) = unaff_D2b;
  FUN_00031c08();
  if (9 < *(byte *)(unaff_A5 + -0x5dd8)) {
    FUN_00005756();
    return;
  }
  FUN_000056e2();
  return;
}



/* 0004e120 FUN_0004e120 */

void FUN_0004e120(void)

{
  undefined1 *unaff_A4;
  int unaff_A5;
  bool bVar1;
  
  if (((*(char *)(unaff_A5 + 0xd68) == '\0') && (*(char *)(unaff_A5 + 0x317) == '\0')) &&
     (bVar1 = *(char *)(unaff_A5 + 0xddb) == '\0', bVar1)) {
    FUN_00003778();
    if (!bVar1) {
      *unaff_A4 = 1;
      unaff_A4[0x20] = 0x36;
      unaff_A4[0x1e] = 8;
      *(undefined1 *)(unaff_A5 + 0xddb) = 1;
    }
  }
  return;
}



/* 00054ca8 FUN_00054ca8 */

void FUN_00054ca8(void)

{
  undefined1 unaff_D2b;
  undefined1 *unaff_A4;
  int unaff_A6;
  undefined1 in_ZF;
  
  FUN_00003778();
  if (!(bool)in_ZF) {
    *unaff_A4 = 1;
    unaff_A4[0x20] = 0x4d;
    *(undefined2 *)(unaff_A4 + 6) = *(undefined2 *)(unaff_A6 + 6);
    *(undefined2 *)(unaff_A4 + 10) = *(undefined2 *)(unaff_A6 + 10);
    unaff_A4[0x12] = *(undefined1 *)(unaff_A6 + 0x12);
    unaff_A4[0xb5] = -*(char *)(unaff_A6 + 0x12);
    unaff_A4[0x21] = unaff_D2b;
  }
  return;
}



/* 000680c8 FUN_000680c8 */

void FUN_000680c8(void)

{
  byte in_D0b;
  short sVar1;
  int in_A0;
  undefined4 *puVar2;
  int unaff_A5;
  
  sVar1 = 4;
  puVar2 = (undefined4 *)(&DAT_000056a2 + unaff_A5);
  do {
    if ((byte)((uint)*puVar2 >> 0x1c) == in_D0b) {
      puVar2[1] = *(undefined4 *)(in_A0 + -4);
      return;
    }
    puVar2 = puVar2 + 2;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 00078480 FUN_00078480 */

void FUN_00078480(void)

{
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x1b2) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 0;
  *(undefined1 *)(unaff_A6 + 0x29d) = 0;
  *(undefined1 *)(unaff_A6 + 0x4d) = 0;
  *(undefined1 *)(unaff_A6 + 0x62) = 0;
  *(undefined1 *)(unaff_A6 + 0x70) = 0;
  *(undefined1 *)(unaff_A6 + 0x56) = 0;
  *(undefined1 *)(unaff_A6 + 0x2a7) = 0;
  *(undefined1 *)(unaff_A6 + 0x2b5) = 0;
  return;
}



/* 00078652 FUN_00078652 */

void FUN_00078652(void)

{
  char cVar1;
  int unaff_A6;
  undefined1 uVar2;
  
  *(undefined1 *)(unaff_A6 + 0x195) = 0;
  *(undefined1 *)(unaff_A6 + 0x2b0) = 0;
  if (*(char *)(unaff_A6 + 0x38e) == '\0') {
    *(undefined2 *)(unaff_A6 + 0x52) = 0;
    FUN_00078794();
    FUN_0007bd36();
    FUN_0007c000();
    return;
  }
  FUN_00004176();
  *(undefined2 *)(unaff_A6 + 0x52) = 0;
  FUN_00078480();
  *(undefined1 *)(unaff_A6 + 3) = 4;
  *(undefined1 *)(unaff_A6 + 4) = 4;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x1e) = 7;
  *(undefined1 *)(unaff_A6 + 0x181) = 0;
  FUN_00007b90();
  cVar1 = *(char *)(unaff_A6 + 0x16c);
  *(undefined1 *)(unaff_A6 + 0x16c) = 0;
  uVar2 = cVar1 == '\0';
  if (!(bool)uVar2) {
    FUN_00078794();
    FUN_000786d4();
    if (!(bool)uVar2) {
      *(undefined1 *)(unaff_A6 + 0x195) = 0;
      *(undefined1 *)(unaff_A6 + 0x2b0) = 0;
      *(undefined1 *)(unaff_A6 + 0x280) = 0;
      cVar1 = *(char *)(unaff_A6 + 0x391);
      if (*(char *)(unaff_A6 + 0x3bd) == '\0') {
        if (*(char *)(unaff_A6 + 0x3b6) != '\0') {
          cVar1 = cVar1 + '\x11';
        }
      }
      else {
        cVar1 = '\x10';
      }
      uVar2 = (undefined1)((ushort)((short)cVar1 << 2) >> 8);
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Could not find normalized switch variable to match jumptable */
      switch(cVar1) {
      case '\0':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000805a8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000805ac +
                  *(short *)(&DAT_000805ac + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x88)))))();
        return;
      case '\x01':
        goto switchD_00078ec8_caseD_1;
      case '\x02':
        if ((*(char *)(unaff_A6 + 0x47) != '\0') &&
           (cVar1 = *(char *)(unaff_A6 + 0x47) + -1, *(char *)(unaff_A6 + 0x47) = cVar1,
           cVar1 != '\0')) {
          *(undefined1 *)(unaff_A6 + 0xa8) = *(undefined1 *)(unaff_A6 + 0x47);
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00082ee4. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00082ee8 +
                  *(short *)(&DAT_00082ee8 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x86)))))();
        return;
      case '\x03':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00084c9e. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00084ca2 +
                  *(short *)(&DAT_00084ca2 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x8b)))))();
        return;
      case '\x04':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000863ba. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000863be +
                  *(short *)(&DAT_000863be + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x88)))))();
        return;
      case '\x05':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00087f02. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00087f06 +
                  *(short *)(&DAT_00087f06 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x86)))))();
        return;
      case '\x06':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00089d4c. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00089d50 +
                  *(short *)(&DAT_00089d50 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x96)))))();
        return;
      case '\a':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0008bce8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0008bcec +
                  *(short *)(&DAT_0008bcec + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x92)))))();
        return;
      case '\b':
                    /* WARNING: Could not recover jumptable at 0x0008ce40. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0008ce44 +
                  *(short *)(&DAT_0008ce44 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x98)))))();
        return;
      case '\t':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0008e3c8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0008e3cc +
                  *(short *)(&DAT_0008e3cc + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x98)))))();
        return;
      case '\n':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0008f830. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0008f834 +
                  *(short *)(&DAT_0008f834 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x87)))))();
        return;
      case '\v':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(undefined1 *)(unaff_A6 + 0x95) = *(undefined1 *)(unaff_A6 + 0x47);
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00090d68. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00090d6c +
                  *(short *)(&DAT_00090d6c + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x94)))))();
        return;
      case '\f':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          cVar1 = *(char *)(unaff_A6 + 0x47) + -1;
          *(char *)(unaff_A6 + 0x47) = cVar1;
          if (cVar1 != '\0') {
            *(undefined1 *)(unaff_A6 + 0xa0) = *(undefined1 *)(unaff_A6 + 0x47);
          }
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00092ce8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00092cec +
                  *(short *)(&DAT_00092cec + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x90)))))();
        return;
      case '\r':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          if (*(char *)(unaff_A6 + 0x47) != '\0') {
            *(undefined1 *)(unaff_A6 + 0x8c) = *(undefined1 *)(unaff_A6 + 0x47);
          }
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000947e8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000947ec +
                  *(short *)(&DAT_000947ec + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x8b)))))();
        return;
      case '\x0e':
                    /* WARNING: Could not recover jumptable at 0x00096060. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00096064 +
                  *(short *)(&DAT_00096064 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x98)))))();
        return;
      case '\x0f':
                    /* WARNING: Could not recover jumptable at 0x000979f2. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000979f6 +
                  *(short *)(&DAT_000979f6 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x90)))))();
        return;
      case '\x10':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000a8b3e. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a8b42 +
                  *(short *)(&DAT_000a8b42 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x88)))))();
        return;
      default:
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x00098f48. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)((int)&PTR_LAB_00098f4c +
                  (int)*(short *)((int)&PTR_LAB_00098f4c +
                                 (int)CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x88)))))();
        return;
      case '\x12':
        if ((*(char *)(unaff_A6 + 0x47) != '\0') &&
           (cVar1 = *(char *)(unaff_A6 + 0x47) + -1, *(char *)(unaff_A6 + 0x47) = cVar1,
           cVar1 != '\0')) {
          *(undefined1 *)(unaff_A6 + 0xa8) = *(undefined1 *)(unaff_A6 + 0x47);
          return;
        }
        if (*(char *)(unaff_A6 + 0xa9) == '\0') {
          *(undefined1 *)(unaff_A6 + 0xa9) = 1;
          *(undefined1 *)(unaff_A6 + 0xa8) = 0;
        }
                    /* WARNING: Could not recover jumptable at 0x00099ea0. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_00099ea4 +
                  *(short *)(&DAT_00099ea4 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x86)))))();
        return;
      case '\x13':
        if ((*(char *)(unaff_A6 + 0x47) != '\0') &&
           (cVar1 = *(char *)(unaff_A6 + 0x47) + -1, *(char *)(unaff_A6 + 0x47) = cVar1,
           cVar1 != '\0')) {
          *(undefined1 *)(unaff_A6 + 0xa8) = *(undefined1 *)(unaff_A6 + 0x47);
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0009ad1e. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0009ad22 +
                  *(short *)(&DAT_0009ad22 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x86)))))();
        return;
      case '\x14':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0009c1ca. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)((int)&PTR_DAT_0009c1ce +
                  (int)*(short *)((int)&PTR_DAT_0009c1ce +
                                 (int)CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x8b)))))();
        return;
      case '\x16':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0009cf86. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0009cf8a +
                  *(short *)(&DAT_0009cf8a + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x86)))))();
        return;
      case '\x17':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0009e5d8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)((int)&PTR_LAB_0009e5dc +
                  (int)*(short *)((int)&PTR_LAB_0009e5dc +
                                 (int)CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x96)))))();
        return;
      case '\x18':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x0009f9d4. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_0009f9d8 +
                  *(short *)(&DAT_0009f9d8 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x92)))))();
        return;
      case '\x19':
                    /* WARNING: Could not recover jumptable at 0x000a0722. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a0726 +
                  *(short *)(&DAT_000a0726 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x98)))))();
        return;
      case '\x1a':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000a181a. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a181e +
                  *(short *)(&DAT_000a181e + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x98)))))();
        return;
      case '\x1b':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000a2582. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a2586 +
                  *(short *)(&DAT_000a2586 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x87)))))();
        return;
      case '\x1c':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(undefined1 *)(unaff_A6 + 0x95) = *(undefined1 *)(unaff_A6 + 0x47);
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000a3340. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a3344 +
                  *(short *)(&DAT_000a3344 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x94)))))();
        return;
      case '\x1d':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          cVar1 = *(char *)(unaff_A6 + 0x47) + -1;
          *(char *)(unaff_A6 + 0x47) = cVar1;
          if (cVar1 != '\0') {
            *(undefined1 *)(unaff_A6 + 0xa0) = *(undefined1 *)(unaff_A6 + 0x47);
          }
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000a4ade. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a4ae2 +
                  *(short *)(&DAT_000a4ae2 + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x90)))))();
        return;
      case '\x1e':
        if (*(char *)(unaff_A6 + 0x47) != '\0') {
          *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
          if (*(char *)(unaff_A6 + 0x47) != '\0') {
            *(undefined1 *)(unaff_A6 + 0x91) = *(undefined1 *)(unaff_A6 + 0x47);
          }
          return;
        }
                    /* WARNING: Could not recover jumptable at 0x000a59a6. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)((int)&PTR_DAT_000a59aa +
                  (int)*(short *)((int)&PTR_DAT_000a59aa +
                                 (int)CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x90)))))();
        return;
      case '\x1f':
                    /* WARNING: Could not recover jumptable at 0x000a698a. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)(&DAT_000a698e +
                  *(short *)(&DAT_000a698e + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x98)))))();
        return;
      case ' ':
                    /* WARNING: Could not recover jumptable at 0x000a7a74. Too many branches */
                    /* WARNING: Treating indirect jump as call */
        (*(code *)((int)&PTR_DAT_000a7a78 +
                  (int)*(short *)((int)&PTR_DAT_000a7a78 +
                                 (int)CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x90)))))();
        return;
      }
    }
  }
  FUN_00005256();
  FUN_0007895c();
  return;
switchD_00078ec8_caseD_1:
  if ((*(char *)(unaff_A6 + 0x47) != '\0') &&
     (cVar1 = *(char *)(unaff_A6 + 0x47) + -1, *(char *)(unaff_A6 + 0x47) = cVar1, cVar1 != '\0')) {
    *(undefined1 *)(unaff_A6 + 0x9a) = *(undefined1 *)(unaff_A6 + 0x47);
    return;
  }
  if (*(char *)(unaff_A6 + 0x9b) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x9b) = 1;
    *(undefined1 *)(unaff_A6 + 0x9a) = 0;
  }
                    /* WARNING: Could not recover jumptable at 0x000818ba. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)(&DAT_000818be +
            *(short *)(&DAT_000818be + CONCAT11(uVar2,*(undefined1 *)(unaff_A6 + 0x80)))))();
  return;
}



/* 000786d4 FUN_000786d4 */

undefined4 FUN_000786d4(void)

{
  char cVar2;
  undefined4 uVar1;
  int unaff_A6;
  bool bVar3;
  
  cVar2 = *(char *)(unaff_A6 + 0x391);
  if (*(char *)(unaff_A6 + 0x3bd) == '\0') {
    if (*(char *)(unaff_A6 + 0x3b6) != '\0') {
      cVar2 = cVar2 + '\x11';
    }
  }
  else {
    cVar2 = '\x10';
  }
  bVar3 = true;
  uVar1 = (**(code **)((int)&PTR_LAB_00078710 + (int)(short)((short)cVar2 << 2)))();
  if (!bVar3) {
    *(undefined1 *)(unaff_A6 + 0x12) = *(undefined1 *)(unaff_A6 + 0x1be);
    *(undefined1 *)(unaff_A6 + 0x291) = 4;
    *(undefined1 *)(unaff_A6 + 0x292) = 0;
    uVar1 = 1;
  }
  return uVar1;
}



/* 00078794 FUN_00078794 */

void FUN_00078794(void)

{
  char cVar1;
  int iVar2;
  int unaff_A6;
  
  cVar1 = *(char *)(unaff_A6 + 500);
  if (cVar1 != '\0') {
    iVar2 = (int)*(short *)(unaff_A6 + 0x39e);
    *(undefined1 *)(iVar2 + 0x291) = 1;
    *(char *)(iVar2 + 0x292) = cVar1 + -1;
    *(undefined1 *)(iVar2 + 0x2c1) = *(undefined1 *)(unaff_A6 + 0x2c0);
    *(undefined1 *)(unaff_A6 + 500) = 0;
    *(undefined1 *)(unaff_A6 + 0x2c0) = 0;
    return;
  }
  if (((*(short *)(unaff_A6 + 0x2a) < 0) &&
      (iVar2 = (int)*(short *)(unaff_A6 + 0x39e), -1 < *(short *)(iVar2 + 0x2a))) &&
     (*(char *)(unaff_A6 + 0x2c2) != '\0')) {
    *(undefined1 *)(iVar2 + 0x291) = 5;
    *(undefined1 *)(iVar2 + 0x292) = 0;
  }
  *(undefined1 *)(unaff_A6 + 500) = 0;
  *(undefined1 *)(unaff_A6 + 0x2c0) = 0;
  return;
}



/* 0007895c FUN_0007895c */

void FUN_0007895c(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
                    /* WARNING: Could not recover jumptable at 0x00078964. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)((int)&PTR_LAB_00078968 +
            (int)*(short *)((int)&PTR_LAB_00078968 +
                           (int)CONCAT11((char)((ushort)in_D0w >> 8),*(undefined1 *)(unaff_A6 + 4)))
            ))();
  return;
}



/* 0007affe FUN_0007affe */

undefined1 FUN_0007affe(void)

{
  int unaff_A6;
  
  return *(undefined1 *)(unaff_A6 + 0x1be);
}



/* 0007b008 FUN_0007b008 */

undefined2 FUN_0007b008(void)

{
  int unaff_A6;
  
  if (*(char *)(unaff_A6 + 0x1ad) == '\0') {
    return *(undefined2 *)(unaff_A6 + 0x392);
  }
  return 0;
}



/* 0007b01c FUN_0007b01c */

undefined4 FUN_0007b01c(void)

{
  int unaff_A6;
  
  if (0x28 < *(ushort *)(unaff_A6 + 10)) {
    return 1;
  }
  *(undefined2 *)(unaff_A6 + 10) = 0x28;
  return 0;
}



/* 0007b032 FUN_0007b032 */

void FUN_0007b032(void)

{
  return;
}



/* 0007b332 FUN_0007b332 */

undefined2 FUN_0007b332(void)

{
  int unaff_A6;
  
  return *(undefined2 *)(unaff_A6 + 0x392);
}



/* 0007bd36 FUN_0007bd36 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007d61a */

/* 0007c000 FUN_0007c000 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007f090 */

/* 0007d5d0 FUN_0007d5d0 */

void FUN_0007d5d0(void)

{
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x260) = *(undefined1 *)(unaff_A6 + 0x170);
  *(undefined1 *)(unaff_A6 + 0x261) = *(undefined1 *)(unaff_A6 + 0x171);
  *(undefined1 *)(unaff_A6 + 0x262) = *(undefined1 *)(unaff_A6 + 0x172);
  *(undefined1 *)(unaff_A6 + 0x263) = *(undefined1 *)(unaff_A6 + 0x173);
  *(undefined1 *)(unaff_A6 + 0x264) = *(undefined1 *)(unaff_A6 + 0x174);
  *(undefined1 *)(unaff_A6 + 0x265) = *(undefined1 *)(unaff_A6 + 0x175);
  *(undefined1 *)(unaff_A6 + 0x266) = *(undefined1 *)(unaff_A6 + 0x176);
  *(undefined1 *)(unaff_A6 + 0x267) = *(undefined1 *)(unaff_A6 + 0x177);
  *(undefined1 *)(unaff_A6 + 0x268) = *(undefined1 *)(unaff_A6 + 0x178);
  *(undefined1 *)(unaff_A6 + 0x269) = *(undefined1 *)(unaff_A6 + 0x179);
  *(undefined1 *)(unaff_A6 + 0x26a) = *(undefined1 *)(unaff_A6 + 0x17a);
  *(undefined1 *)(unaff_A6 + 0x26b) = *(undefined1 *)(unaff_A6 + 0x17b);
  *(undefined1 *)(unaff_A6 + 0x26c) = *(undefined1 *)(unaff_A6 + 0x17c);
  *(undefined1 *)(unaff_A6 + 0x26d) = *(undefined1 *)(unaff_A6 + 0x17d);
  *(undefined1 *)(unaff_A6 + 0x26e) = *(undefined1 *)(unaff_A6 + 0x17e);
  *(undefined1 *)(unaff_A6 + 0x26f) = *(undefined1 *)(unaff_A6 + 0x17f);
  return;
}



/* 0007d632 FUN_0007d632 */

void FUN_0007d632(void)

{
  int unaff_A6;
  
  *(char *)(unaff_A6 + 0x170) = *(char *)(unaff_A6 + 0x260);
  if (*(char *)(unaff_A6 + 0x260) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x241) = 0;
  }
  *(char *)(unaff_A6 + 0x171) = *(char *)(unaff_A6 + 0x261);
  if (*(char *)(unaff_A6 + 0x261) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x242) = 0;
  }
  *(char *)(unaff_A6 + 0x172) = *(char *)(unaff_A6 + 0x262);
  if (*(char *)(unaff_A6 + 0x262) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x243) = 0;
  }
  *(char *)(unaff_A6 + 0x173) = *(char *)(unaff_A6 + 0x263);
  if (*(char *)(unaff_A6 + 0x263) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x244) = 0;
  }
  *(char *)(unaff_A6 + 0x174) = *(char *)(unaff_A6 + 0x264);
  if (*(char *)(unaff_A6 + 0x264) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x245) = 0;
  }
  *(char *)(unaff_A6 + 0x175) = *(char *)(unaff_A6 + 0x265);
  if (*(char *)(unaff_A6 + 0x265) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x246) = 0;
  }
  *(char *)(unaff_A6 + 0x176) = *(char *)(unaff_A6 + 0x266);
  if (*(char *)(unaff_A6 + 0x266) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x247) = 0;
  }
  *(char *)(unaff_A6 + 0x177) = *(char *)(unaff_A6 + 0x267);
  if (*(char *)(unaff_A6 + 0x267) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x248) = 0;
  }
  *(char *)(unaff_A6 + 0x178) = *(char *)(unaff_A6 + 0x268);
  if (*(char *)(unaff_A6 + 0x268) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x249) = 0;
  }
  *(char *)(unaff_A6 + 0x179) = *(char *)(unaff_A6 + 0x269);
  if (*(char *)(unaff_A6 + 0x269) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x24a) = 0;
  }
  *(char *)(unaff_A6 + 0x17a) = *(char *)(unaff_A6 + 0x26a);
  if (*(char *)(unaff_A6 + 0x26a) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x24b) = 0;
  }
  *(char *)(unaff_A6 + 0x17b) = *(char *)(unaff_A6 + 0x26b);
  if (*(char *)(unaff_A6 + 0x26b) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x24c) = 0;
  }
  *(char *)(unaff_A6 + 0x17c) = *(char *)(unaff_A6 + 0x26c);
  if (*(char *)(unaff_A6 + 0x26c) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x24d) = 0;
  }
  *(char *)(unaff_A6 + 0x17d) = *(char *)(unaff_A6 + 0x26d);
  if (*(char *)(unaff_A6 + 0x26d) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x24e) = 0;
  }
  *(char *)(unaff_A6 + 0x17e) = *(char *)(unaff_A6 + 0x26e);
  if (*(char *)(unaff_A6 + 0x26e) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x24f) = 0;
  }
  *(char *)(unaff_A6 + 0x17f) = *(char *)(unaff_A6 + 0x26f);
  if (*(char *)(unaff_A6 + 0x26f) == '\0') {
    *(undefined1 *)(unaff_A6 + 0x250) = 0;
  }
  return;
}



/* 0007d726 FUN_0007d726 */

uint FUN_0007d726(void)

{
  uint uVar1;
  
  uVar1 = FUN_00002e96();
  return uVar1 & 0xffff001f;
}



/* 0007d91c FUN_0007d91c */

undefined1 FUN_0007d91c(void)

{
  ushort uVar1;
  
  uVar1 = FUN_00002e96();
  return (&DAT_0007d92a)[(short)(uVar1 & 0x1f)];
}



/* 0007d9ae FUN_0007d9ae */

undefined4 FUN_0007d9ae(void)

{
  undefined1 uVar1;
  int unaff_A6;
  bool bVar2;
  
  if ((*(char *)(unaff_A6 + 0x170 + (int)(short)(ushort)*(byte *)(unaff_A6 + 0x16e)) != '\0') &&
     (bVar2 = *(char *)(unaff_A6 + 0x241 + (int)(short)(ushort)*(byte *)(unaff_A6 + 0x16e)) == '\0',
     bVar2)) {
    FUN_0007d726();
    if (bVar2) {
      uVar1 = FUN_0007d91c();
      *(undefined1 *)(unaff_A6 + 0x241 + (int)(short)(ushort)*(byte *)(unaff_A6 + 0x16e)) = uVar1;
    }
    else {
      FUN_0007d9f6();
      if (!bVar2) {
        FUN_0007da2c();
        return 1;
      }
    }
  }
  return 0;
}



/* 0007d9f6 FUN_0007d9f6 */

undefined4 FUN_0007d9f6(void)

{
  int unaff_A6;
  
  if ((*(char *)(unaff_A6 + 0x19b) == '\0') && (*(char *)(unaff_A6 + 0x16f) == '\0')) {
    if (*(char *)(unaff_A6 + 0x200) != '\x06') {
      *(undefined1 *)(unaff_A6 + 0x16f) = 1;
      return 1;
    }
    if (*(char *)(unaff_A6 + 0x16e) != *(char *)(unaff_A6 + 0x27d)) {
      *(undefined1 *)(unaff_A6 + 0x16f) = 1;
      return 2;
    }
  }
  return 0;
}



/* 0007da2c FUN_0007da2c */

void FUN_0007da2c(void)

{
  char in_D0b;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x27d) = *(undefined1 *)(unaff_A6 + 0x16e);
  if (in_D0b == '\x02') {
    FUN_0007d632();
  }
  else {
    if (in_D0b == '\x03') {
      *(undefined1 *)(unaff_A6 + 0x200) = *(undefined1 *)(unaff_A6 + 0x218);
      FUN_0007d632();
      *(undefined1 *)(unaff_A6 + 0x201) = 0;
      *(undefined1 *)(unaff_A6 + 0x202) = 0;
      *(undefined1 *)(unaff_A6 + 0x210) = 0;
      *(undefined1 *)(unaff_A6 + 0x161) = 0;
      *(undefined1 *)(unaff_A6 + 0x147) = 0;
      *(undefined1 *)(unaff_A6 + 0x215) = 0;
      *(undefined1 *)(unaff_A6 + 0x213) = 0;
      *(byte *)(unaff_A6 + 0x211) = *(byte *)(unaff_A6 + 0x211) | 2;
      FUN_0007e36e();
      *(undefined1 *)(unaff_A6 + 600) = 1;
      return;
    }
    if (*(char *)(unaff_A6 + 0x200) == '\0') {
      *(undefined1 *)(unaff_A6 + 0x218) = *(undefined1 *)(unaff_A6 + 0x200);
      FUN_0007d5d0();
    }
    else {
      FUN_0007d632();
      if (*(char *)(unaff_A6 + 0x200) != '\x04') {
        *(undefined1 *)(unaff_A6 + 0x218) = *(undefined1 *)(unaff_A6 + 0x200);
      }
    }
    *(undefined1 *)(unaff_A6 + 0x200) = 6;
  }
  FUN_0007e42a();
  *(undefined1 *)(unaff_A6 + 0x270) = 0;
  *(undefined1 *)(unaff_A6 + 0x271) = 0;
  *(undefined1 *)(unaff_A6 + 0x272) = 0;
  *(undefined1 *)(unaff_A6 + 0x147) = 0;
  *(undefined1 *)(unaff_A6 + 0x213) = 0;
  *(undefined1 *)(unaff_A6 + 0x22b) = 0;
  *(undefined1 *)(unaff_A6 + 0x212) = 0;
  *(undefined1 *)(unaff_A6 + 0x201) = 0;
  *(undefined1 *)(unaff_A6 + 0x202) = 0;
  *(undefined1 *)(unaff_A6 + 0x213) = 0;
  *(undefined1 *)(unaff_A6 + 0x215) = 0;
  *(byte *)(unaff_A6 + 0x211) = *(byte *)(unaff_A6 + 0x211) | 2;
  *(undefined1 *)(unaff_A6 + 600) = 1;
  return;
}



/* 0007e36e FUN_0007e36e */

void FUN_0007e36e(void)

{
  int unaff_A6;
  
  *(undefined2 *)(unaff_A6 + 0x140) = *(undefined2 *)(unaff_A6 + 0x1d6);
  FUN_0007e37e();
  FUN_0007e3b2();
  FUN_0007e3d8();
  return;
}



/* 0007e37e FUN_0007e37e */

void FUN_0007e37e(void)

{
  short *psVar1;
  short sVar2;
  ushort uVar3;
  int unaff_A6;
  
  uVar3 = (ushort)*(byte *)(unaff_A6 + 0x391);
  if (*(char *)(unaff_A6 + 0x3bd) != '\0') {
    uVar3 = 0x10;
  }
  psVar1 = *(short **)(&DAT_0024ebf8 + (short)(uVar3 << 2));
  sVar2 = psVar1[1];
  *(int *)(unaff_A6 + 0x1e0) = (int)psVar1 + (int)*psVar1;
  *(int *)(unaff_A6 + 0x1e4) = (int)psVar1 + (int)sVar2;
  return;
}



/* 0007e3b2 FUN_0007e3b2 */

void FUN_0007e3b2(void)

{
  undefined1 *puVar1;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x216) = 0;
  puVar1 = (undefined1 *)
           (*(int *)(unaff_A6 + 0x1e0) +
           (int)*(short *)(*(int *)(unaff_A6 + 0x1e0) +
                          (int)(short)(*(short *)(unaff_A6 + 0x1d6) * 2)));
  *(undefined1 **)(unaff_A6 + 0x130) = puVar1;
  *(undefined1 *)(unaff_A6 + 0x20e) = *puVar1;
  *(undefined2 *)(unaff_A6 + 0x138) = 1;
  return;
}



/* 0007e3d8 FUN_0007e3d8 */

void FUN_0007e3d8(void)

{
  undefined1 *puVar1;
  char cVar2;
  ushort uVar3;
  int extraout_A1;
  int iVar4;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x216) = 0;
  iVar4 = *(int *)(unaff_A6 + 0x1e4) +
          (int)*(short *)(*(int *)(unaff_A6 + 0x1e4) +
                         (int)(short)(*(short *)(unaff_A6 + 0x1d6) * 2));
  if (*(char *)(unaff_A6 + 0x1ee) != '\0') {
    iVar4 = iVar4 + 0x20;
  }
  uVar3 = FUN_00002e96();
  cVar2 = *(char *)(iVar4 + (short)(uVar3 & 0xff1f));
  *(char *)(unaff_A6 + 0x23e) = cVar2;
  puVar1 = (undefined1 *)(extraout_A1 + *(short *)(extraout_A1 + 0x40 + (int)(short)(cVar2 * 2)));
  *(undefined1 **)(unaff_A6 + 0x134) = puVar1;
  *(undefined1 *)(unaff_A6 + 0x20f) = *puVar1;
  *(undefined2 *)(unaff_A6 + 0x13a) = 1;
  return;
}



/* 0007e42a FUN_0007e42a */

void FUN_0007e42a(void)

{
  undefined1 *puVar1;
  byte bVar2;
  ushort uVar3;
  int extraout_A0;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x216) = 0;
  uVar3 = FUN_00002e96();
  bVar2 = *(byte *)(extraout_A0 + (short)(uVar3 & 0x1f));
  *(byte *)(unaff_A6 + 0x27e) = bVar2;
  puVar1 = (undefined1 *)
           (extraout_A0 + 0x20 +
           (int)*(short *)(extraout_A0 + 0x20 + (int)(short)((ushort)bVar2 * 2)));
  *(undefined1 **)(unaff_A6 + 0x1e8) = puVar1;
  *(undefined1 *)(unaff_A6 + 0x27c) = *puVar1;
  *(undefined2 *)(unaff_A6 + 0x1ec) = 1;
  *(undefined1 *)(unaff_A6 + 0x27f) = 0;
  if ((puVar1[1] & 1) != 0) {
    *(undefined1 *)(unaff_A6 + 0x27f) = 1;
    *(undefined2 *)(unaff_A6 + 0x1ec) = 2;
  }
  return;
}



/* 0007f2ae FUN_0007f2ae */

void FUN_0007f2ae(void)

{
  short sVar1;
  ushort uVar2;
  int extraout_A0;
  int extraout_A0_00;
  undefined2 *unaff_A4;
  int unaff_A5;
  
  uVar2 = FUN_00002e96();
  *(short *)(unaff_A5 + -0x75ce) =
       (short)(char)(&DAT_0007f39a)[(short)(uVar2 & 0x1f)] + *(short *)(unaff_A5 + -0x75ce);
  if (*(short *)(unaff_A5 + -0x75ce) < 0) {
    *(undefined2 *)(unaff_A5 + -0x75ce) = 1;
  }
  uVar2 = FUN_00002e96();
  sVar1 = (short)*(char *)(extraout_A0 + (short)(uVar2 & 0x1f)) + *(short *)(unaff_A5 + -0x75ce);
  *(short *)(unaff_A5 + -0x75ce) = sVar1;
  if (sVar1 < 0) {
    *unaff_A4 = 1;
  }
  uVar2 = FUN_00002e96();
  sVar1 = (short)*(char *)(extraout_A0_00 + (short)(uVar2 & 0x1f)) + *(short *)(unaff_A5 + -0x75ce);
  *(short *)(unaff_A5 + -0x75ce) = sVar1;
  if (sVar1 < 0) {
    *(undefined2 *)(unaff_A5 + -0x75ce) = 1;
  }
  return;
}



/* 0007f8b8 FUN_0007f8b8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000851f4 */

/* 0007fa4a FUN_0007fa4a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00079c94 */

/* 0007fba8 FUN_0007fba8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0007fd6e FUN_0007fd6e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0007fed2 FUN_0007fed2 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00080594 caseD_0 */

void switchD_00078ec8::caseD_0(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
  if (*(char *)(unaff_A6 + 0x47) != '\0') {
    *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
    return;
  }
                    /* WARNING: Could not recover jumptable at 0x000805a8. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)(&DAT_000805ac +
            *(short *)(&DAT_000805ac +
                      CONCAT11((char)((ushort)in_D0w >> 8),*(undefined1 *)(unaff_A6 + 0x88)))))();
  return;
}



/* 00080bfa FUN_00080bfa */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00087210 */

/* 00080d8a FUN_00080d8a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007ba64 */

/* 00080efc FUN_00080efc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00081060 FUN_00081060 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007b8a6 */

/* 0008119c FUN_0008119c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007d6c6 */

/* 00082152 FUN_00082152 */

ushort FUN_00082152(void)

{
  ushort uVar1;
  ushort uVar2;
  undefined1 uVar3;
  int unaff_A5;
  int unaff_A6;
  bool bVar4;
  
  if (((*(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394) & 0x700) == 0x700) ||
     (uVar1 = *(ushort *)(unaff_A6 + 0x394) & ~*(ushort *)(unaff_A6 + 0x392), uVar2 = uVar1 & 0x700,
     (uVar1 & 0x700) == 0x700)) {
    uVar1 = *(ushort *)(unaff_A6 + 0x3a6);
    uVar2 = uVar1 & 3;
    uVar3 = 10;
    if (((uVar1 & 2) != 0) || (uVar3 = 0xc, (uVar1 & 1) != 0)) {
      *(undefined1 *)(unaff_A6 + 0xd1) = uVar3;
      bVar4 = *(char *)(unaff_A6 + 0x16d) == '\0';
      if (bVar4) {
        *(undefined1 *)(unaff_A6 + 0x16a) = uVar3;
        *(undefined1 *)(unaff_A6 + 0x16b) = 0;
      }
      uVar2 = FUN_00004542();
      if (bVar4) {
        *(undefined1 *)(unaff_A6 + 0x86) = *(undefined1 *)(unaff_A6 + 0xd1);
        *(undefined1 *)(unaff_A6 + 3) = 0xc;
        *(undefined1 *)(unaff_A6 + 4) = 0;
        *(undefined1 *)(unaff_A6 + 5) = 0;
        FUN_00005b60();
        *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
        *(undefined1 *)(unaff_A6 + 0x18b) = 0;
        return 0xffff;
      }
      if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
        *(undefined1 *)(unaff_A6 + 0x16d) = 1;
      }
    }
  }
  return uVar2;
}



/* 000821ca FUN_000821ca */

undefined4 FUN_000821ca(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  FUN_00005b60();
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  *(undefined1 *)(unaff_A6 + 0x18b) = 0;
  return 0xffffffff;
}



/* 000821ea FUN_000821ea */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00082304 FUN_00082304 */

undefined4 FUN_00082304(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xc6) = *(undefined1 *)(unaff_A6 + 0xc5);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 199) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xc1) = 0;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 8;
  return 0xffffffff;
}



/* 00082372 FUN_00082372 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00087238 */

/* 00082494 FUN_00082494 */

undefined4 FUN_00082494(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xb3) = *(undefined1 *)(unaff_A6 + 0xb2);
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xb0) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 4;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00004052();
  return 0xffffffff;
}



/* 000824d4 FUN_000824d4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00082604 FUN_00082604 */

undefined4 FUN_00082604(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xbe) = *(undefined1 *)(unaff_A6 + 0xbf);
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xb9) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 6;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00004052();
  return 0xffffffff;
}



/* 00082644 FUN_00082644 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00087210 */

/* 00082772 FUN_00082772 */

undefined4 FUN_00082772(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x87) = *(undefined1 *)(unaff_A6 + 0x88);
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x80) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00004052();
  return 0xffffffff;
}



/* 00082834 FUN_00082834 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000828f6 FUN_000828f6 */

undefined4 FUN_000828f6(void)

{
  undefined1 in_D0b;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x98) = in_D0b;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 2;
  FUN_00004052();
  return 0xffffffff;
}



/* 00083926 FUN_00083926 */

void FUN_00083926(void)

{
  int unaff_A6;
  
  if (((*(byte *)(unaff_A6 + 0x14) & 1) != 0) && (*(short *)(unaff_A6 + 0x18) == 1)) {
    FUN_00007cba();
  }
  FUN_00002ee2();
  return;
}



/* 00083c06 FUN_00083c06 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00083d5e FUN_00083d5e */

undefined4 FUN_00083d5e(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x8b) = 4;
  *(undefined1 *)(unaff_A6 + 0x99) = *(undefined1 *)(unaff_A6 + 0x16b);
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 1;
}



/* 00083d8e FUN_00083d8e */

void FUN_00083d8e(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
                    /* WARNING: Could not recover jumptable at 0x00083d96. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)(&DAT_00083d9a +
            *(short *)(&DAT_00083d9a +
                      CONCAT11((char)((ushort)in_D0w >> 8),*(undefined1 *)(unaff_A6 + 0x80)))))();
  return;
}



/* 00083f40 FUN_00083f40 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007c79c */

/* 000851f6 FUN_000851f6 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00085328 FUN_00085328 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008545a FUN_0008545a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000927ca */

/* 000855ce FUN_000855ce */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008f83a */

/* 0008574c FUN_0008574c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007f090 */

/* 000858aa FUN_000858aa */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008f390 */

/* 00085a22 FUN_00085a22 */

undefined4 FUN_00085a22(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0xa3) = *(undefined1 *)(unaff_A6 + 0x16b);
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xa0) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 1;
}



/* 00085a4c FUN_00085a4c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00086fa4 FUN_00086fa4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000870e8 FUN_000870e8 */

undefined4 FUN_000870e8(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x92) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xbf) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 8;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 0xffffffff;
}



/* 00087116 FUN_00087116 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007f090 */

/* 00087272 FUN_00087272 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000873ea FUN_000873ea */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00087534 FUN_00087534 */

undefined4 FUN_00087534(void)

{
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0xb4) = 0;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x84) = *(undefined1 *)(unaff_A6 + 0xa7);
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x80) = 0;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  FUN_00004052();
  return 0xffffffff;
}



/* 000875bc FUN_000875bc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00087682 FUN_00087682 */

undefined4 FUN_00087682(void)

{
  undefined1 in_D0b;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x98) = in_D0b;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 2;
  FUN_00004052();
  return 0xffffffff;
}



/* 00088826 FUN_00088826 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008c346 */

/* 00088a4a FUN_00088a4a */

undefined4 FUN_00088a4a(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x96) = 8;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xac) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x2bf) = 1;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 0xffffffff;
}



/* 00088a90 FUN_00088a90 */

undefined4 FUN_00088a90(void)

{
  bool bVar1;
  
  bVar1 = false;
  FUN_00004604();
  if (!bVar1) {
    FUN_00088a4a();
    return 1;
  }
  return 0;
}



/* 00088ad4 FUN_00088ad4 */

ushort FUN_00088ad4(void)

{
  ushort uVar1;
  ushort uVar2;
  int unaff_A5;
  int unaff_A6;
  bool bVar3;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394);
  uVar2 = uVar1 & 0x70;
  if ((uVar1 & 0x70) == 0x70) {
    bVar3 = *(char *)(unaff_A6 + 0x16d) == '\0';
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 0x16a) = 0;
      *(undefined1 *)(unaff_A6 + 0x16b) = 0;
    }
    uVar2 = FUN_00004542();
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x18b) = 1;
      *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
      FUN_00005b60();
      *(undefined1 *)(unaff_A6 + 0x95) = 0;
      FUN_00007ca0();
      FUN_00004052();
      *(undefined1 *)(unaff_A6 + 0x96) = 0;
      return 0xffff;
    }
    if (*(char *)(unaff_A6 + 0x169) != '\0') {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
  }
  return uVar2;
}



/* 00088b4c FUN_00088b4c */

ushort FUN_00088b4c(void)

{
  ushort uVar1;
  ushort uVar2;
  int unaff_A5;
  int unaff_A6;
  bool bVar3;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394);
  uVar2 = uVar1 & 0x700;
  if ((uVar1 & 0x700) == 0x700) {
    bVar3 = *(char *)(unaff_A6 + 0x16d) == '\0';
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 0x16a) = 6;
      *(undefined1 *)(unaff_A6 + 0x16b) = 0;
    }
    uVar2 = FUN_00004542();
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x18b) = 1;
      *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
      FUN_00005b60();
      *(undefined1 *)(unaff_A6 + 0x95) = 0;
      FUN_00007ca0();
      FUN_00004052();
      *(undefined1 *)(unaff_A6 + 0x96) = 6;
      return 0xffff;
    }
    if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
  }
  return uVar2;
}



/* 00088c48 FUN_00088c48 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00088ef0 FUN_00088ef0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008ad9c FUN_0008ad9c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008af6a FUN_0008af6a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008b10a FUN_0008b10a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008b2aa FUN_0008b2aa */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008b4ac FUN_0008b4ac */

undefined4 FUN_0008b4ac(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x99) = *(undefined1 *)(unaff_A6 + 0x16b);
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x96) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 1;
}



/* 0008b4d6 FUN_0008b4d6 */

void FUN_0008b4d6(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
                    /* WARNING: Could not recover jumptable at 0x0008b4de. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)((int)&PTR_DAT_0008b4e2 +
            (int)*(short *)((int)&PTR_DAT_0008b4e2 +
                           (int)CONCAT11((char)((ushort)in_D0w >> 8),
                                         *(undefined1 *)(unaff_A6 + 0x80)))))();
  return;
}



/* 0008c1b2 FUN_0008c1b2 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000927ca */

/* 0008c300 FUN_0008c300 */

undefined4 FUN_0008c300(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x98) = 8;
  *(undefined1 *)(unaff_A6 + 0xca) = *(undefined1 *)(unaff_A6 + 0x16b);
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xc5) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 1;
}



/* 0008c330 FUN_0008c330 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008c346 */

/* 0008c4b8 FUN_0008c4b8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008c626 FUN_0008c626 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000927ca */

/* 0008c794 FUN_0008c794 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000871f6 */

/* 0008d1e2 FUN_0008d1e2 */

void FUN_0008d1e2(void)

{
  char cVar1;
  int unaff_A6;
  
  FUN_00002f50();
  if (*(char *)(unaff_A6 + 5) < '\0') {
    if ((*(ushort *)(unaff_A6 + 0x392) & 1) != 0) {
      *(int *)(unaff_A6 + 6) = (int)(&DAT_00050000 + *(int *)(unaff_A6 + 6));
    }
    if ((*(ushort *)(unaff_A6 + 0x392) & 2) != 0) {
      *(int *)(unaff_A6 + 6) = *(int *)(unaff_A6 + 6) + -0x50000;
    }
    return;
  }
  if (*(char *)(unaff_A6 + 5) == '\0') {
    if (*(short *)(unaff_A6 + 0x3e) < 0) {
      *(char *)(unaff_A6 + 5) = *(char *)(unaff_A6 + 5) + '\x02';
      *(undefined1 *)(unaff_A6 + 0x1e) = 8;
      *(short *)(unaff_A6 + 0x40) = *(short *)(unaff_A6 + 0x3c) >> 3;
    }
  }
  else {
    cVar1 = *(char *)(unaff_A6 + 0x1e) + -1;
    *(char *)(unaff_A6 + 0x1e) = cVar1;
    if (cVar1 == '\0') {
      *(char *)(unaff_A6 + 5) = *(char *)(unaff_A6 + 5) + -4;
      *(undefined2 *)(unaff_A6 + 0x3c) = 0;
      *(undefined2 *)(unaff_A6 + 0x40) = 0;
      return;
    }
  }
  return;
}



/* 0008d9aa FUN_0008d9aa */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008db5e FUN_0008db5e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008dcbc FUN_0008dcbc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008de14 FUN_0008de14 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008df78 FUN_0008df78 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008e972 FUN_0008e972 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008eace FUN_0008eace */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008ec30 FUN_0008ec30 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00095d56 */

/* 0008eda0 FUN_0008eda0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008a14a */

/* 0008ef0e FUN_0008ef0e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008a14a */

/* 0008f06a FUN_0008f06a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0008f1cc FUN_0008f1cc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008fec8 */

/* 0008f2ce FUN_0008f2ce */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008f398 */

/* 00090182 FUN_00090182 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00090312 FUN_00090312 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009047a FUN_0009047a */

undefined4 FUN_0009047a(void)

{
  undefined4 uVar1;
  short extraout_D1w;
  int unaff_A6;
  bool bVar2;
  
  uVar1 = FUN_000044d0();
  if ((short)uVar1 == extraout_D1w) {
    bVar2 = *(char *)(unaff_A6 + 0x16d) == '\0';
    if (bVar2) {
      *(undefined1 *)(unaff_A6 + 0x16a) = 4;
      *(undefined1 *)(unaff_A6 + 0x16b) = 0;
    }
    uVar1 = FUN_00004542();
    if (bVar2) {
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x95) = 0;
      FUN_00005b60();
      *(undefined1 *)(unaff_A6 + 0x94) = 4;
      *(undefined1 *)(unaff_A6 + 0x18b) = 0;
      FUN_00004052();
      return 1;
    }
    if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
  }
  return uVar1;
}



/* 000904de FUN_000904de */

undefined4 FUN_000904de(void)

{
  undefined4 uVar1;
  short extraout_D1w;
  int unaff_A6;
  bool bVar2;
  
  uVar1 = FUN_000044d0();
  if ((short)uVar1 != extraout_D1w) {
    return uVar1;
  }
  bVar2 = *(char *)(unaff_A6 + 0x16d) == '\0';
  if (bVar2) {
    *(undefined1 *)(unaff_A6 + 0x16a) = 8;
    *(undefined1 *)(unaff_A6 + 0x16b) = 0;
  }
  uVar1 = FUN_00004542();
  if (!bVar2) {
    if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
    return uVar1;
  }
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x95) = 0;
  FUN_00005b60();
  *(undefined1 *)(unaff_A6 + 0x94) = 8;
  *(undefined1 *)(unaff_A6 + 0x18b) = 0;
  FUN_00004052();
  return 1;
}



/* 00090542 FUN_00090542 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000906a4 FUN_000906a4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00091ad2 FUN_00091ad2 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00091c38 FUN_00091c38 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00091dba FUN_00091dba */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00098f84 */

/* 00091f1e FUN_00091f1e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000927ca */

/* 00092088 FUN_00092088 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0008a704 */

/* 00093b5c FUN_00093b5c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00093e0e FUN_00093e0e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009f062 */

/* 00093f5a FUN_00093f5a */

ushort FUN_00093f5a(void)

{
  ushort uVar1;
  ushort in_D0w;
  int unaff_A5;
  int unaff_A6;
  bool bVar2;
  
  if (((*(char *)(unaff_A6 + 0x181) != '\0') && (0x37 < *(ushort *)(unaff_A6 + 10))) &&
     (-1 < *(short *)(unaff_A6 + 0x3e))) {
    bVar2 = (*(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394) & 0x770) == 0x70;
    if (!bVar2) {
      uVar1 = *(ushort *)(unaff_A6 + 0x394) & ~*(ushort *)(unaff_A6 + 0x392);
      bVar2 = (uVar1 & 0x770) == 0x70;
      if (!bVar2) {
        return uVar1 & 0x770;
      }
    }
    in_D0w = FUN_00004532();
    if (bVar2) {
      *(undefined1 *)(unaff_A6 + 0x8b) = 2;
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x8c) = 0;
      *(undefined1 *)(unaff_A6 + 0x18b) = 1;
      *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
      FUN_00005b60();
      FUN_00004052();
      return 1;
    }
  }
  return in_D0w;
}



/* 00093fd0 FUN_00093fd0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00098432 */

/* 00095168 FUN_00095168 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000952d4 FUN_000952d4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009543e FUN_0009543e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009fe64 */

/* 000955ac FUN_000955ac */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009a4c4 */

/* 00096bd4 FUN_00096bd4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00096d36 FUN_00096d36 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00096ea4 FUN_00096ea4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00097014 FUN_00097014 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00097184 FUN_00097184 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00098432 */

/* 00098436 FUN_00098436 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000985bc FUN_000985bc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a27de */

/* 00098714 FUN_00098714 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00098872 FUN_00098872 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x00099106 */

/* 00099578 FUN_00099578 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a45c0 */

/* 0009969a FUN_0009969a */

undefined4 FUN_0009969a(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xad) = *(undefined1 *)(unaff_A6 + 0xac);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xaa) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 4;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 000996ca FUN_000996ca */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a0726 */

/* 000997ee FUN_000997ee */

undefined4 FUN_000997ee(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x87) = *(undefined1 *)(unaff_A6 + 0x88);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0xa9) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x80) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 00099866 FUN_00099866 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 00099928 FUN_00099928 */

undefined4 FUN_00099928(void)

{
  undefined1 in_D0b;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x98) = in_D0b;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 2;
  return 0xffffffff;
}



/* 0009a2c6 FUN_0009a2c6 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009cb5c */

/* 0009a3e8 FUN_0009a3e8 */

undefined4 FUN_0009a3e8(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xb3) = *(undefined1 *)(unaff_A6 + 0xb2);
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xb0) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 4;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 0009a422 FUN_0009a422 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009a552 FUN_0009a552 */

undefined4 FUN_0009a552(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xbe) = *(undefined1 *)(unaff_A6 + 0xbf);
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0xb9) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 6;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 0009a58c FUN_0009a58c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000927ca */

/* 0009a6b4 FUN_0009a6b4 */

undefined4 FUN_0009a6b4(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x87) = *(undefined1 *)(unaff_A6 + 0x88);
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0xa8) = 0;
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x80) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 0009a748 FUN_0009a748 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009a80a FUN_0009a80a */

undefined4 FUN_0009a80a(void)

{
  undefined1 in_D0b;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x98) = in_D0b;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xae) = *(undefined1 *)(unaff_A6 + 0x47);
  *(undefined1 *)(unaff_A6 + 0x47) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 2;
  return 0xffffffff;
}



/* 0009b406 FUN_0009b406 */

void FUN_0009b406(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
                    /* WARNING: Could not recover jumptable at 0x0009b40e. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)(&DAT_0009b412 +
            *(short *)(&DAT_0009b412 +
                      CONCAT11((char)((ushort)in_D0w >> 8),*(undefined1 *)(unaff_A6 + 0x80)))))();
  return;
}



/* 0009b53c FUN_0009b53c */

undefined4 FUN_0009b53c(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x90) = *(undefined1 *)(unaff_A6 + 0x92);
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x80) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x8b) = 0;
  FUN_00005b60();
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 0009b5a8 FUN_0009b5a8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a21c8 */

/* 0009b6d0 FUN_0009b6d0 */

undefined4 FUN_0009b6d0(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x91) = *(undefined1 *)(unaff_A6 + 0x93);
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x8b) = 2;
  FUN_00005b60();
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  return 0xffffffff;
}



/* 0009c380 FUN_0009c380 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009c4c8 FUN_0009c4c8 */

undefined1 FUN_0009c4c8(void)

{
  int unaff_A5;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0xb0) = 0;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
  FUN_00005b60();
  return 1;
}



/* 0009c4ee FUN_0009c4ee */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009c62e FUN_0009c62e */

undefined4 FUN_0009c62e(void)

{
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0xb4) = 0;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 0x84) = *(undefined1 *)(unaff_A6 + 0xa7);
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x80) = 0;
  *(undefined1 *)(unaff_A6 + 0x86) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  return 0xffffffff;
}



/* 0009c69a FUN_0009c69a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009c760 FUN_0009c760 */

undefined4 FUN_0009c760(void)

{
  undefined1 in_D0b;
  int unaff_A6;
  
  *(undefined1 *)(unaff_A6 + 0x98) = in_D0b;
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x18b) = 1;
  *(undefined1 *)(unaff_A6 + 0x86) = 2;
  return 0xffffffff;
}



/* 0009d4a8 FUN_0009d4a8 */

ushort FUN_0009d4a8(void)

{
  ushort uVar1;
  ushort uVar2;
  int unaff_A5;
  int unaff_A6;
  bool bVar3;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394);
  uVar2 = uVar1 & 0x70;
  if ((uVar1 & 0x70) == 0x70) {
    *(undefined1 *)(unaff_A6 + 0x16a) = 0;
    *(undefined1 *)(unaff_A6 + 0x16b) = 0;
    bVar3 = true;
    uVar2 = FUN_00004542();
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x18b) = 1;
      *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
      FUN_00005b60();
      *(undefined1 *)(unaff_A6 + 0x95) = 0;
      FUN_00007ca0();
      *(undefined1 *)(unaff_A6 + 0x96) = 0;
      return 0xffff;
    }
    if (*(char *)(unaff_A6 + 0x169) != '\0') {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
  }
  return uVar2;
}



/* 0009d516 FUN_0009d516 */

ushort FUN_0009d516(void)

{
  ushort uVar1;
  ushort uVar2;
  int unaff_A5;
  int unaff_A6;
  bool bVar3;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394);
  uVar2 = uVar1 & 0x700;
  if ((uVar1 & 0x700) == 0x700) {
    bVar3 = *(char *)(unaff_A6 + 0x16d) == '\0';
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 0x16a) = 6;
      *(undefined1 *)(unaff_A6 + 0x16b) = 0;
    }
    uVar2 = FUN_00004542();
    if (bVar3) {
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x18b) = 1;
      *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
      FUN_00005b60();
      *(undefined1 *)(unaff_A6 + 0x95) = 0;
      FUN_00007ca0();
      *(undefined1 *)(unaff_A6 + 0x96) = 6;
      return 0xffff;
    }
    if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
  }
  return uVar2;
}



/* 0009d5f8 FUN_0009d5f8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009d89a FUN_0009d89a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009dfaa */

/* 0009efa0 FUN_0009efa0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009f168 FUN_0009f168 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a594c */

/* 0009f302 FUN_0009f302 */

void FUN_0009f302(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
                    /* WARNING: Could not recover jumptable at 0x0009f30a. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)((int)&PTR_DAT_0009f30e +
            (int)*(short *)((int)&PTR_DAT_0009f30e +
                           (int)CONCAT11((char)((ushort)in_D0w >> 8),
                                         *(undefined1 *)(unaff_A6 + 0x80)))))();
  return;
}



/* 0009fcd4 FUN_0009fcd4 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 0009fe44 FUN_0009fe44 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009fe64 */

/* 0009ffa0 FUN_0009ffa0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a7cc2 */

/* 000a0108 FUN_000a0108 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a45c0 */

/* 000a0fc8 FUN_000a0fc8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a1120 FUN_000a1120 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a1272 FUN_000a1272 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a13d0 FUN_000a13d0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a1be8 FUN_000a1be8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009fe64 */

/* 000a1d50 FUN_000a1d50 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a1ea0 FUN_000a1ea0 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a7ec4 */

/* 000a1ffc FUN_000a1ffc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a20fe FUN_000a20fe */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a21c8 */

/* 000a2916 FUN_000a2916 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000aadb4 */

/* 000a2a72 FUN_000a2a72 */

undefined4 FUN_000a2a72(void)

{
  undefined4 uVar1;
  short extraout_D1w;
  int unaff_A6;
  bool bVar2;
  
  uVar1 = FUN_000044d0();
  if ((short)uVar1 == extraout_D1w) {
    bVar2 = *(char *)(unaff_A6 + 0x16d) == '\0';
    if (bVar2) {
      *(undefined1 *)(unaff_A6 + 0x16a) = 4;
      *(undefined1 *)(unaff_A6 + 0x16b) = 0;
    }
    uVar1 = FUN_00004542();
    if (bVar2) {
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x95) = 0;
      FUN_00005b60();
      *(undefined1 *)(unaff_A6 + 0x94) = 4;
      *(undefined1 *)(unaff_A6 + 0x18b) = 0;
      return 1;
    }
    if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
  }
  return uVar1;
}



/* 000a2ad0 FUN_000a2ad0 */

undefined4 FUN_000a2ad0(void)

{
  undefined4 uVar1;
  short extraout_D1w;
  int unaff_A6;
  bool bVar2;
  
  uVar1 = FUN_000044d0();
  if ((short)uVar1 != extraout_D1w) {
    return uVar1;
  }
  bVar2 = *(char *)(unaff_A6 + 0x16d) == '\0';
  if (bVar2) {
    *(undefined1 *)(unaff_A6 + 0x16a) = 8;
    *(undefined1 *)(unaff_A6 + 0x16b) = 0;
  }
  uVar1 = FUN_00004542();
  if (!bVar2) {
    if ((*(char *)(unaff_A6 + 0x16d) == '\0') && (*(char *)(unaff_A6 + 0x169) != '\0')) {
      *(undefined1 *)(unaff_A6 + 0x16d) = 1;
    }
    return uVar1;
  }
  *(undefined1 *)(unaff_A6 + 3) = 0xc;
  *(undefined1 *)(unaff_A6 + 4) = 0;
  *(undefined1 *)(unaff_A6 + 5) = 0;
  *(undefined1 *)(unaff_A6 + 0x95) = 0;
  FUN_00005b60();
  *(undefined1 *)(unaff_A6 + 0x94) = 8;
  *(undefined1 *)(unaff_A6 + 0x18b) = 0;
  return 1;
}



/* 000a2b2e FUN_000a2b2e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a2c90 FUN_000a2c90 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a3c0a FUN_000a3c0a */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a99fc */

/* 000a3d68 FUN_000a3d68 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a3ec8 FUN_000a3ec8 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0009fe64 */

/* 000a4fde FUN_000a4fde */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a5124 FUN_000a5124 */

ushort FUN_000a5124(void)

{
  ushort uVar1;
  ushort in_D0w;
  int unaff_A5;
  int unaff_A6;
  bool bVar2;
  
  if (((*(char *)(unaff_A6 + 0x181) != '\0') && (0x37 < *(ushort *)(unaff_A6 + 10))) &&
     (-1 < *(short *)(unaff_A6 + 0x3e))) {
    bVar2 = (*(ushort *)(unaff_A6 + 0x392) & ~*(ushort *)(unaff_A6 + 0x394) & 0x770) == 0x70;
    if (!bVar2) {
      uVar1 = *(ushort *)(unaff_A6 + 0x394) & ~*(ushort *)(unaff_A6 + 0x392) & 0x770;
      bVar2 = uVar1 == 0x70;
      if (!bVar2) {
        return uVar1;
      }
    }
    in_D0w = FUN_00004532();
    if (bVar2) {
      *(undefined1 *)(unaff_A6 + 0x90) = 2;
      *(undefined1 *)(unaff_A6 + 3) = 0xc;
      *(undefined1 *)(unaff_A6 + 4) = 0;
      *(undefined1 *)(unaff_A6 + 5) = 0;
      *(undefined1 *)(unaff_A6 + 0x91) = 0;
      *(undefined1 *)(unaff_A6 + 0x18b) = 1;
      *(short *)(unaff_A5 + 0xde2) = *(short *)(unaff_A5 + 0xde2) + 1;
      FUN_00005b60();
      return 1;
    }
  }
  return in_D0w;
}



/* 000a5194 FUN_000a5194 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a27f6 */

/* 000a5ec2 FUN_000a5ec2 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a601e FUN_000a601e */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a6f40 FUN_000a6f40 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a70a2 FUN_000a70a2 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a720c FUN_000a720c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a7e9c FUN_000a7e9c */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a7ec4 */

/* 000a7eca FUN_000a7eca */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a8042 FUN_000a8042 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a81ce FUN_000a81ce */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x000a27de */

/* 000a8326 FUN_000a8326 */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a84be FUN_000a84be */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000a9d7e FUN_000a9d7e */

void FUN_000a9d7e(void)

{
  int unaff_A6;
  
  if (((*(short *)(unaff_A6 + 0x3c) == 0) && (*(char *)(unaff_A6 + 0x186) == '\0')) &&
     (*(char *)(unaff_A6 + 0x187) == '\x04')) {
    if (*(char *)(unaff_A6 + 0x146) == '\0') {
      if (*(char *)(unaff_A6 + 0x14d) == '\0') {
        return;
      }
      *(undefined2 *)(unaff_A6 + 0x3c) = 0xfe80;
    }
    else {
      *(undefined2 *)(unaff_A6 + 0x3c) = 0x180;
    }
    if (*(char *)(unaff_A6 + 0x12) == '\0') {
      *(short *)(unaff_A6 + 0x3c) = -*(short *)(unaff_A6 + 0x3c);
    }
  }
  return;
}



/* 000abefc FUN_000abefc */
/* DECOMPILATION FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* 000abf64 FUN_000abf64 */

undefined4 FUN_000abf64(void)

{
  ushort uVar1;
  int unaff_A6;
  
  uVar1 = *(short *)(unaff_A6 + 10) - 0x28;
  if (*(short *)(unaff_A6 + 0x3e) < 0) {
    if (uVar1 < 0x30) {
      return 0;
    }
  }
  else if (uVar1 < 0x20) {
    return 0;
  }
  return 1;
}



/* 000aca8a FUN_000aca8a */

undefined1 FUN_000aca8a(void)

{
  int unaff_A6;
  bool bVar1;
  
  if (((*(char *)(unaff_A6 + 0x146) != '\0') && (*(char *)(unaff_A6 + 0x186) != '\0')) &&
     (bVar1 = *(char *)(unaff_A6 + 0x187) == '\x04', bVar1)) {
    FUN_000acac0();
    if (!bVar1) {
      bVar1 = false;
      FUN_0000460c();
      if (!bVar1) {
        *(undefined1 *)(unaff_A6 + 3) = 10;
        return 0xff;
      }
    }
  }
  return 0;
}



/* 000acac0 FUN_000acac0 */

undefined4 FUN_000acac0(void)

{
  int unaff_A6;
  
  if (0x2f < (ushort)(*(short *)(unaff_A6 + 10) - 0x28U)) {
    return 1;
  }
  return 0;
}



/* 000ad2be FUN_000ad2be */

undefined4 FUN_000ad2be(void)

{
  int unaff_A6;
  bool bVar1;
  
  if (((*(char *)(unaff_A6 + 0x186) == '\0') && (*(char *)(unaff_A6 + 0x146) != '\0')) &&
     (bVar1 = *(char *)(unaff_A6 + 0x187) == '\0', !bVar1)) {
    FUN_000ad2ec();
    if (!bVar1) {
      bVar1 = false;
      FUN_0000460c();
      if (!bVar1) {
        *(undefined1 *)(unaff_A6 + 3) = 10;
        return 0xffffffff;
      }
    }
  }
  return 0;
}



/* 000ad2ec FUN_000ad2ec */

undefined4 FUN_000ad2ec(void)

{
  int unaff_A6;
  
  if (0x2f < (ushort)(*(short *)(unaff_A6 + 10) - 0x28U)) {
    return 1;
  }
  return 0;
}



/* 000ae2a8 FUN_000ae2a8 */

undefined4 FUN_000ae2a8(void)

{
  int unaff_A6;
  bool bVar1;
  
  if (((*(char *)(unaff_A6 + 0x186) == '\0') && (*(char *)(unaff_A6 + 0x146) != '\0')) &&
     (bVar1 = *(char *)(unaff_A6 + 0x187) == '\0', !bVar1)) {
    FUN_000ae2f0();
    if (!bVar1) {
      if (*(char *)(unaff_A6 + 0x187) == '\x02') {
        bVar1 = false;
        FUN_0000460c();
        if (!bVar1) {
          *(undefined1 *)(unaff_A6 + 3) = 10;
          return 0xffffffff;
        }
      }
      else {
        bVar1 = false;
        FUN_0000460c();
        if (!bVar1) {
          *(undefined1 *)(unaff_A6 + 3) = 10;
          return 0xffffffff;
        }
      }
    }
  }
  return 0;
}



/* 000ae2f0 FUN_000ae2f0 */

undefined4 FUN_000ae2f0(void)

{
  int unaff_A6;
  
  if (0x2f < (ushort)(*(short *)(unaff_A6 + 10) - 0x28U)) {
    return 1;
  }
  return 0;
}



/* 000b2a0c FUN_000b2a0c */

undefined4 FUN_000b2a0c(void)

{
  int unaff_A6;
  bool bVar1;
  
  if (((*(char *)(unaff_A6 + 0x186) == '\0') && (*(char *)(unaff_A6 + 0x146) != '\0')) &&
     (bVar1 = *(char *)(unaff_A6 + 0x187) == '\0', !bVar1)) {
    FUN_000b2a3a();
    if (!bVar1) {
      bVar1 = false;
      FUN_0000460c();
      if (!bVar1) {
        *(undefined1 *)(unaff_A6 + 3) = 10;
        return 0xffffffff;
      }
    }
  }
  return 0;
}



/* 000b2a3a FUN_000b2a3a */

undefined4 FUN_000b2a3a(void)

{
  int unaff_A6;
  
  if (0x2f < (ushort)(*(short *)(unaff_A6 + 10) - 0x28U)) {
    return 1;
  }
  return 0;
}



/* 000b3caa FUN_000b3caa */

undefined1 FUN_000b3caa(void)

{
  int unaff_A6;
  bool bVar1;
  
  if ((*(char *)(unaff_A6 + 0x146) != '\0') &&
     (bVar1 = *(char *)(unaff_A6 + 0x187) == '\x04', bVar1)) {
    FUN_000b3cf8();
    if (!bVar1) {
      if (*(char *)(unaff_A6 + 0x186) == '\0') {
        bVar1 = false;
        FUN_0000460c();
        if (!bVar1) {
          *(undefined1 *)(unaff_A6 + 3) = 10;
          return 0xff;
        }
      }
      else {
        bVar1 = false;
        FUN_0000460c();
        if (!bVar1) {
          *(undefined1 *)(unaff_A6 + 3) = 10;
          return 0xff;
        }
      }
    }
  }
  return 0;
}



/* 000b3cf8 FUN_000b3cf8 */

undefined4 FUN_000b3cf8(void)

{
  int unaff_A6;
  
  if (0x2f < (ushort)(*(short *)(unaff_A6 + 10) - 0x28U)) {
    return 1;
  }
  return 0;
}



/* 000b5e96 FUN_000b5e96 */

undefined1 FUN_000b5e96(void)

{
  int unaff_A6;
  bool bVar1;
  
  if (((*(char *)(unaff_A6 + 0x146) != '\0') && (*(char *)(unaff_A6 + 0x186) == '\0')) &&
     (bVar1 = *(char *)(unaff_A6 + 0x187) == '\x04', bVar1)) {
    FUN_000b5ecc();
    if (!bVar1) {
      bVar1 = false;
      FUN_0000460c();
      if (!bVar1) {
        *(undefined1 *)(unaff_A6 + 3) = 10;
        return 0xff;
      }
    }
  }
  return 0;
}



/* 000b5ecc FUN_000b5ecc */

undefined4 FUN_000b5ecc(void)

{
  ushort uVar1;
  int unaff_A6;
  
  uVar1 = *(short *)(unaff_A6 + 10) - 0x28;
  if (*(short *)(unaff_A6 + 0x3e) < 0) {
    if (uVar1 < 0x50) {
      return 0;
    }
  }
  else if (uVar1 < 0x40) {
    return 0;
  }
  return 1;
}



/* 000b8650 FUN_000b8650 */

void FUN_000b8650(void)

{
  undefined2 *puVar1;
  char in_D0b;
  int unaff_A6;
  
  if ((*(char *)(unaff_A6 + 0x38e) != '\0') && (*(char *)(unaff_A6 + 0x3b6) != '\0')) {
    puVar1 = (undefined2 *)
             ((int)&PTR_DAT_000b887e +
             (int)(short)((short)in_D0b << 3) +
             (int)*(short *)((int)&PTR_DAT_000b887e +
                            (int)(short)((ushort)*(byte *)(unaff_A6 + 0x391) * 2)));
    *(undefined2 *)(unaff_A6 + 100) = *puVar1;
    *(undefined2 *)(unaff_A6 + 0x66) = puVar1[1];
    *(undefined2 *)(unaff_A6 + 0x68) = puVar1[2];
    *(undefined2 *)(unaff_A6 + 0x6a) = puVar1[3];
    return;
  }
  puVar1 = (undefined2 *)
           ((int)&PTR_DAT_000b868c +
           (int)(short)((short)in_D0b << 3) +
           (int)*(short *)((int)&PTR_DAT_000b868c +
                          (int)(short)((ushort)*(byte *)(unaff_A6 + 0x391) * 2)));
  *(undefined2 *)(unaff_A6 + 100) = *puVar1;
  *(undefined2 *)(unaff_A6 + 0x66) = puVar1[1];
  *(undefined2 *)(unaff_A6 + 0x68) = puVar1[2];
  *(undefined2 *)(unaff_A6 + 0x6a) = puVar1[3];
  return;
}



/* 000bf588 FUN_000bf588 */

undefined8 FUN_000bf588(void)

{
  char cVar1;
  undefined4 in_D0;
  undefined4 uVar2;
  uint uVar3;
  int unaff_A2;
  
  uVar3 = 8;
  cVar1 = *(char *)(*(int *)(unaff_A2 + 0x1a) + 0xd);
  uVar2 = CONCAT31((int3)((uint)in_D0 >> 8),cVar1);
  if (cVar1 != '\0') {
    uVar3 = (uint)*(ushort *)(*(int *)(unaff_A2 + 0x34) + 8);
    uVar2 = 1;
  }
  return CONCAT44(uVar2,uVar3);
}



/* 000bf5ba FUN_000bf5ba */

void FUN_000bf5ba(void)

{
  short sVar1;
  short sVar2;
  int unaff_A2;
  char *unaff_A3;
  char *unaff_A4;
  int unaff_A5;
  int unaff_A6;
  
  sVar1 = (short)*unaff_A3;
  if (*(char *)(unaff_A6 + 0x12) != '\0') {
    sVar1 = -sVar1;
  }
  sVar1 = *(short *)(unaff_A6 + 6) + sVar1;
  *(short *)(unaff_A5 + -0x56fc) = sVar1;
  sVar2 = (short)*unaff_A4;
  if (*(char *)(unaff_A2 + 0x12) != '\0') {
    sVar2 = -sVar2;
  }
  sVar2 = *(short *)(unaff_A2 + 6) + sVar2;
  *(short *)(unaff_A5 + -0x56f8) = sVar2;
  if ((ushort)((short)unaff_A4[2] + (short)unaff_A3[2] + (sVar1 - sVar2)) <=
      (ushort)(((short)unaff_A4[2] + (short)unaff_A3[2]) * 2)) {
    sVar1 = *(short *)(unaff_A6 + 10) + (short)unaff_A3[1];
    *(short *)(unaff_A5 + -0x56fa) = sVar1;
    sVar2 = *(short *)(unaff_A2 + 10) + (short)unaff_A4[1];
    *(short *)(unaff_A5 + -0x56f6) = sVar2;
    if ((ushort)((short)unaff_A4[3] + (short)unaff_A3[3] + (sVar1 - sVar2)) <=
        (ushort)(((short)unaff_A4[3] + (short)unaff_A3[3]) * 2)) {
      return;
    }
  }
  return;
}



/* 000bf656 FUN_000bf656 */

void FUN_000bf656(void)

{
  int unaff_A5;
  undefined4 unaff_A6;
  
  *(undefined4 *)(unaff_A5 + -0x56e6) = unaff_A6;
  FUN_000bf662();
  return;
}



/* 000bf662 FUN_000bf662 */

ushort FUN_000bf662(void)

{
  ushort in_D0w;
  ushort uVar1;
  byte bVar2;
  byte bVar3;
  ushort unaff_D2w;
  ushort uVar4;
  ushort uVar5;
  short sVar6;
  int unaff_A5;
  bool bVar7;
  
  if (((*(char *)(unaff_A5 + 0xcb3) == '\0') && (*(char *)(unaff_A5 + 0x317) == '\0')) &&
     (*(char *)(unaff_A5 + 0xc62) != '\0')) {
    return in_D0w;
  }
  *(undefined2 *)(unaff_A5 + -0x5678) = 0;
  bVar7 = *(char *)(unaff_A5 + 0x44e) == '\0';
  if (bVar7) {
    return in_D0w;
  }
  uVar1 = FUN_000bf588();
  if (bVar7) {
    return uVar1;
  }
  bVar7 = *(char *)(unaff_A5 + 0x84e) == '\0';
  if (bVar7) {
    return uVar1;
  }
  uVar1 = FUN_000bf588();
  if (bVar7) {
    return uVar1;
  }
  uVar1 = FUN_000bf5ba();
  if (bVar7) {
    return uVar1;
  }
  if (unaff_D2w != 0) {
    *(undefined2 *)(unaff_A5 + -0x5678) = 1;
  }
  uVar1 = unaff_D2w + 8;
  if ((0x10 < uVar1) && ((short)unaff_D2w < 0)) {
    uVar1 = 0;
  }
  sVar6 = uVar1 - 8;
  if (*(char *)(unaff_A5 + 0x9cf) == '\0' && *(char *)(unaff_A5 + 0x5cf) == '\0') {
LAB_000bf6d2:
    uVar1 = unaff_D2w;
    if ((short)unaff_D2w < 0) {
      uVar1 = -unaff_D2w;
    }
    bVar7 = (uVar1 & 1) != 0;
    sVar6 = (short)uVar1 >> 1;
    uVar1 = (ushort)bVar7;
    if ((short)unaff_D2w < 0) {
      uVar1 = -(ushort)bVar7;
      sVar6 = -sVar6;
    }
    uVar4 = (ushort)((uint)*(undefined4 *)(unaff_A5 + 0x612) >> 8);
    if ((short)uVar4 < 0) {
      uVar4 = -uVar4;
    }
    uVar5 = (ushort)((uint)*(undefined4 *)(unaff_A5 + 0xa12) >> 8);
    if ((short)uVar5 < 0) {
      uVar5 = -uVar5;
    }
    if (uVar5 != uVar4) {
      if (uVar5 < uVar4) {
        *(short *)(unaff_A5 + 0x454) = *(short *)(unaff_A5 + 0x454) - sVar6;
        *(short *)(unaff_A5 + 0x454) = *(short *)(unaff_A5 + 0x454) - uVar1;
        *(short *)(unaff_A5 + 0x854) = sVar6 + *(short *)(unaff_A5 + 0x854);
        *(undefined1 *)(unaff_A5 + 0x5ae) = 1;
        *(undefined1 *)(unaff_A5 + 0x9ae) = 0;
        if (-1 < (char)sVar6) {
          *(undefined1 *)(unaff_A5 + 0x5ae) = 0;
          *(undefined1 *)(unaff_A5 + 0x9ae) = 1;
          return uVar1;
        }
      }
      else {
        *(short *)(unaff_A5 + 0x854) = sVar6 + *(short *)(unaff_A5 + 0x854);
        *(short *)(unaff_A5 + 0x854) = uVar1 + *(short *)(unaff_A5 + 0x854);
        *(short *)(unaff_A5 + 0x454) = *(short *)(unaff_A5 + 0x454) - sVar6;
        *(undefined1 *)(unaff_A5 + 0x5ae) = 1;
        *(undefined1 *)(unaff_A5 + 0x9ae) = 0;
        if (-1 < (char)sVar6) {
          *(undefined1 *)(unaff_A5 + 0x5ae) = 0;
          *(undefined1 *)(unaff_A5 + 0x9ae) = 1;
        }
      }
      return uVar1;
    }
    *(short *)(unaff_A5 + 0x454) = *(short *)(unaff_A5 + 0x454) - sVar6;
    *(short *)(unaff_A5 + 0x854) = sVar6 + *(short *)(unaff_A5 + 0x854);
    *(undefined1 *)(unaff_A5 + 0x5ae) = 1;
    *(undefined1 *)(unaff_A5 + 0x9ae) = 0;
    return uVar1;
  }
  bVar2 = *(byte *)(unaff_A5 + 0x896);
  if ((bVar2 == 0) && (bVar2 = *(byte *)(unaff_A5 + 0x8a9), bVar2 == 0)) {
    bVar2 = *(byte *)(unaff_A5 + 0x496);
    if ((bVar2 == 0) && (bVar2 = *(byte *)(unaff_A5 + 0x4a9), bVar2 == 0)) {
      bVar2 = *(byte *)(unaff_A5 + 0x9cf) & *(byte *)(unaff_A5 + 0x5cf);
      uVar1 = (ushort)bVar2;
      if (((bVar2 == 0) || (uVar1 = 0, *(short *)(unaff_A5 + 0x48a) == 0)) ||
         (uVar1 = 0, *(short *)(unaff_A5 + 0x88a) == 0)) {
        sVar6 = sVar6 >> 1;
        *(short *)(unaff_A5 + 0x854) = sVar6 + *(short *)(unaff_A5 + 0x854);
        *(short *)(unaff_A5 + 0x454) = *(short *)(unaff_A5 + 0x454) - sVar6;
        *(undefined1 *)(unaff_A5 + 0x5ae) = 1;
        *(undefined1 *)(unaff_A5 + 0x9ae) = 0;
        if (-1 < (char)sVar6) {
          *(undefined1 *)(unaff_A5 + 0x5ae) = 0;
          *(undefined1 *)(unaff_A5 + 0x9ae) = 1;
        }
        return uVar1;
      }
      goto LAB_000bf6d2;
    }
    uVar1 = (ushort)bVar2;
    bVar3 = *(byte *)(unaff_A5 + 0x896);
    if ((bVar3 == 0) && (bVar3 = *(byte *)(unaff_A5 + 0x8a9), bVar3 == 0)) {
      if (bVar2 == 1) {
        if (sVar6 < 0) {
          sVar6 = -sVar6;
        }
      }
      else if (-1 < sVar6) {
        sVar6 = -sVar6;
      }
      goto LAB_000bf850;
    }
    if (bVar3 != bVar2) {
      return uVar1;
    }
  }
  else {
    uVar1 = (ushort)bVar2;
    bVar3 = *(byte *)(unaff_A5 + 0x496);
    if ((bVar3 == 0) && (bVar3 = *(byte *)(unaff_A5 + 0x4a9), bVar3 == 0)) {
      if (bVar2 == 1) {
        if (-1 < sVar6) {
          sVar6 = -sVar6;
        }
      }
      else if (sVar6 < 0) {
        sVar6 = -sVar6;
      }
      goto LAB_000bf874;
    }
    if (bVar3 != bVar2) {
      return uVar1;
    }
  }
  uVar1 = *(ushort *)(unaff_A5 + 0x458);
  if (uVar1 < *(ushort *)(unaff_A5 + 0x858)) {
    if (bVar3 == 1) {
      if (sVar6 < 0) {
        sVar6 = -sVar6;
      }
    }
    else if (-1 < sVar6) {
      sVar6 = -sVar6;
    }
LAB_000bf850:
    *(short *)(unaff_A5 + 0x854) = sVar6 + *(short *)(unaff_A5 + 0x854);
    *(undefined1 *)(unaff_A5 + 0x5ae) = 1;
    *(undefined1 *)(unaff_A5 + 0x9ae) = 0;
    if ((char)sVar6 < '\0') {
      return uVar1;
    }
    *(undefined1 *)(unaff_A5 + 0x5ae) = 0;
    *(undefined1 *)(unaff_A5 + 0x9ae) = 1;
    return uVar1;
  }
  if (bVar3 == 1) {
    if (-1 < sVar6) {
      sVar6 = -sVar6;
    }
  }
  else if (sVar6 < 0) {
    sVar6 = -sVar6;
  }
LAB_000bf874:
  *(short *)(unaff_A5 + 0x454) = *(short *)(unaff_A5 + 0x454) - sVar6;
  *(undefined1 *)(unaff_A5 + 0x5ae) = 1;
  *(undefined1 *)(unaff_A5 + 0x9ae) = 0;
  if (-1 < (char)unaff_D2w) {
    return uVar1;
  }
  *(undefined1 *)(unaff_A5 + 0x5ae) = 0;
  *(undefined1 *)(unaff_A5 + 0x9ae) = 1;
  return uVar1;
}



/* 000bfa42 FUN_000bfa42 */

void FUN_000bfa42(void)

{
  FUN_000bfade();
  return;
}



/* 000bfa78 FUN_000bfa78 */

void FUN_000bfa78(void)

{
  undefined4 uVar1;
  short sVar2;
  short sVar3;
  short *psVar4;
  short *psVar5;
  undefined4 *puVar6;
  undefined4 *puVar7;
  int unaff_A5;
  
  uVar1 = FUN_000bfade();
  puVar6 = (undefined4 *)0x900200;
  psVar5 = (short *)(&DAT_000bfaf2 +
                    (int)*(short *)(&DAT_000bfaf2 +
                                   (int)(short)CONCAT31((int3)((uint)uVar1 >> 8),
                                                        *(char *)(unaff_A5 + 0xbff) * '\x02') +
                                   (int)*(short *)(&DAT_000bfaf2 +
                                                  (short)((short)((uint)uVar1 >> 8) << 8))) +
                    (int)*(short *)(&DAT_000bfaf2 + (short)((short)((uint)uVar1 >> 8) << 8)));
  psVar4 = psVar5 + 1;
  sVar2 = *psVar5 + -1;
  do {
    sVar3 = 7;
    psVar5 = psVar4;
    puVar7 = puVar6;
    do {
      psVar4 = psVar5 + 2;
      puVar6 = puVar7 + 1;
      *puVar7 = *(undefined4 *)psVar5;
      sVar3 = sVar3 + -1;
      psVar5 = psVar4;
      puVar7 = puVar6;
    } while (sVar3 != -1);
    sVar2 = sVar2 + -1;
  } while (sVar2 != -1);
  return;
}



/* 000bfade FUN_000bfade */

void FUN_000bfade(void)

{
  short sVar1;
  short sVar2;
  short *in_A0;
  short *psVar3;
  short *psVar4;
  undefined4 *in_A1;
  undefined4 *puVar5;
  
  psVar3 = in_A0 + 1;
  sVar1 = *in_A0 + -1;
  do {
    sVar2 = 7;
    psVar4 = psVar3;
    puVar5 = in_A1;
    do {
      psVar3 = psVar4 + 2;
      in_A1 = puVar5 + 1;
      *puVar5 = *(undefined4 *)psVar4;
      sVar2 = sVar2 + -1;
      psVar4 = psVar3;
      puVar5 = in_A1;
    } while (sVar2 != -1);
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000c6320 FUN_000c6320 */

void FUN_000c6320(void)

{
  FUN_00002834();
  FUN_00002834();
  return;
}



/* 000c66ca FUN_000c66ca */

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_000c66ca(void)

{
  int unaff_A5;
  
  *(undefined1 *)(unaff_A5 + 0x38c) = 0xff;
  *(undefined1 *)(unaff_A5 + 0x364) = 1;
  FUN_000018ec();
  *(undefined2 *)(unaff_A5 + 700) = 0x2c0;
  FUN_000c6a52();
  FUN_000c6a18();
  if (((&DAT_000061ca)[unaff_A5] != '\0') &&
     (*(undefined2 *)(unaff_A5 + 0x3a4) = *(undefined2 *)(unaff_A5 + 0x2c4),
     *(char *)(unaff_A5 + 0x364) == '\0')) {
    FUN_00002aee();
    _DAT_008040e0 = *(undefined2 *)(unaff_A5 + 0x2c4);
    *(undefined2 *)(unaff_A5 + 0x3a4) = *(undefined2 *)(unaff_A5 + 0x2c4);
    *(undefined1 *)(unaff_A5 + 0x2c8) = 0;
    FUN_00001d66();
    return;
  }
  *(undefined1 *)(unaff_A5 + 0x364) = 0;
  FUN_00002aee();
  return;
}



/* 000c6a18 FUN_000c6a18 */

void FUN_000c6a18(void)

{
  ushort uVar1;
  ushort unaff_D7w;
  short sVar2;
  undefined4 *in_A0;
  ushort *puVar3;
  int unaff_A5;
  
  puVar3 = (ushort *)(unaff_A5 + 0x2be);
  uVar1 = *(ushort *)(unaff_A5 + 0x2c4);
  if (*(char *)(unaff_A5 + 0x2c8) != '\0') {
    uVar1 = uVar1 ^ 1;
  }
  if (uVar1 != 0) {
    puVar3 = (ushort *)(unaff_A5 + 0x2c0);
  }
  sVar2 = unaff_D7w - *puVar3;
  if (*puVar3 <= unaff_D7w && sVar2 != 0) {
    sVar2 = sVar2 + -1;
    do {
      *in_A0 = 0;
      in_A0[1] = 0;
      in_A0 = in_A0 + -2;
      sVar2 = sVar2 + -1;
    } while (sVar2 != -1);
  }
  *puVar3 = unaff_D7w;
  *(undefined1 *)(unaff_A5 + 0x38c) = 0;
  return;
}



/* 000c6a52 FUN_000c6a52 */

void FUN_000c6a52(void)

{
  int unaff_A5;
  
  *(undefined2 *)(unaff_A5 + -0x56d4) = 0x3ff;
  FUN_000c6c08();
  FUN_000c6be0();
  FUN_000c6b66();
  FUN_000c6ac2();
  FUN_000c6b3c();
  FUN_000c6d48();
  FUN_000c6c30();
  FUN_000c6d20();
  FUN_000c6c58();
  return;
}



/* 000c6ac2 FUN_000c6ac2 */

void FUN_000c6ac2(void)

{
  int unaff_A5;
  
  if (*(char *)(unaff_A5 + 0x2f5) == '\0') {
    FUN_000c6bb6();
    FUN_000c6c80();
    FUN_000c6d98();
    FUN_000c6b24();
    FUN_000c6bcc();
    FUN_000c6ca8();
    FUN_000c6d98();
    FUN_000c6b24();
    FUN_000c6cd0();
    FUN_000c6cf8();
    return;
  }
  FUN_000c6bcc();
  FUN_000c6ca8();
  FUN_000c6d98();
  FUN_000c6b24();
  FUN_000c6bb6();
  FUN_000c6c80();
  FUN_000c6d98();
  FUN_000c6b24();
  FUN_000c6cf8();
  FUN_000c6cd0();
  return;
}



/* 000c6b24 FUN_000c6b24 */

void FUN_000c6b24(void)

{
  char *in_A1;
  
  if ((*in_A1 != '\0') && (in_A1[1] != '\0')) {
    in_A1[0x5a] = in_A1[0x181];
    FUN_000c6e6a();
    return;
  }
  return;
}



/* 000c6b3c FUN_000c6b3c */

void FUN_000c6b3c(void)

{
  int unaff_A5;
  
  if (((&DAT_000015a2)[unaff_A5] != '\0') && ((&DAT_000015a3)[unaff_A5] != '\0')) {
    FUN_000c6e6a();
  }
  if (((&DAT_000016a2)[unaff_A5] != '\0') && ((&DAT_000016a3)[unaff_A5] != '\0')) {
    FUN_000c6e6a();
    return;
  }
  return;
}



/* 000c6b66 FUN_000c6b66 */

undefined1 FUN_000c6b66(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_00001555)[unaff_A5] = (&DAT_00001546)[unaff_A5];
  *(undefined2 *)(&DAT_0000156e + unaff_A5) = *(undefined2 *)(&DAT_0000156a + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001546)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_0000156a + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001546)[unaff_A5] + -1;
      (&DAT_00001546)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_0000156a + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6bb6 FUN_000c6bb6 */

void FUN_000c6bb6(void)

{
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + -0x5ef2) != '\0') && (*(char *)(unaff_A5 + -0x5ef1) != '\0')) {
    FUN_000c6e6a();
    return;
  }
  return;
}



/* 000c6bcc FUN_000c6bcc */

void FUN_000c6bcc(void)

{
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + -0x5e72) != '\0') && (*(char *)(unaff_A5 + -0x5e71) != '\0')) {
    FUN_000c6e6a();
    return;
  }
  return;
}



/* 000c6be0 FUN_000c6be0 */

undefined1 FUN_000c6be0(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_00001557)[unaff_A5] = (&DAT_0000154d)[unaff_A5];
  *(undefined2 *)(&DAT_00001592 + unaff_A5) = *(undefined2 *)(&DAT_00001582 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_0000154d)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001582 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_0000154d)[unaff_A5] + -1;
      (&DAT_0000154d)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001582 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6c08 FUN_000c6c08 */

undefined1 FUN_000c6c08(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_00001558)[unaff_A5] = (&DAT_0000154e)[unaff_A5];
  *(undefined2 *)(&DAT_00001594 + unaff_A5) = *(undefined2 *)(&DAT_00001584 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_0000154e)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001584 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_0000154e)[unaff_A5] + -1;
      (&DAT_0000154e)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001584 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6c30 FUN_000c6c30 */

undefined1 FUN_000c6c30(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_00001559)[unaff_A5] = (&DAT_0000154f)[unaff_A5];
  *(undefined2 *)(&DAT_00001596 + unaff_A5) = *(undefined2 *)(&DAT_00001586 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_0000154f)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001586 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_0000154f)[unaff_A5] + -1;
      (&DAT_0000154f)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001586 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6c58 FUN_000c6c58 */

undefined1 FUN_000c6c58(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_0000155a)[unaff_A5] = (&DAT_00001550)[unaff_A5];
  *(undefined2 *)(&DAT_00001598 + unaff_A5) = *(undefined2 *)(&DAT_00001588 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001550)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001588 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001550)[unaff_A5] + -1;
      (&DAT_00001550)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001588 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6c80 FUN_000c6c80 */

undefined1 FUN_000c6c80(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_0000155b)[unaff_A5] = (&DAT_00001551)[unaff_A5];
  *(undefined2 *)(&DAT_0000159a + unaff_A5) = *(undefined2 *)(&DAT_0000158a + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001551)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_0000158a + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001551)[unaff_A5] + -1;
      (&DAT_00001551)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_0000158a + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6ca8 FUN_000c6ca8 */

undefined1 FUN_000c6ca8(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_0000155c)[unaff_A5] = (&DAT_00001552)[unaff_A5];
  *(undefined2 *)(&DAT_0000159c + unaff_A5) = *(undefined2 *)(&DAT_0000158c + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001552)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_0000158c + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001552)[unaff_A5] + -1;
      (&DAT_00001552)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_0000158c + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6cd0 FUN_000c6cd0 */

undefined1 FUN_000c6cd0(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_0000155d)[unaff_A5] = (&DAT_00001553)[unaff_A5];
  *(undefined2 *)(&DAT_0000159e + unaff_A5) = *(undefined2 *)(&DAT_0000158e + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001553)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_0000158e + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001553)[unaff_A5] + -1;
      (&DAT_00001553)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_0000158e + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6cf8 FUN_000c6cf8 */

undefined1 FUN_000c6cf8(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_0000155e)[unaff_A5] = (&DAT_00001554)[unaff_A5];
  *(undefined2 *)(&DAT_000015a0 + unaff_A5) = *(undefined2 *)(&DAT_00001590 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001554)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001590 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001554)[unaff_A5] + -1;
      (&DAT_00001554)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001590 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6d20 FUN_000c6d20 */

undefined1 FUN_000c6d20(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_0000155f)[unaff_A5] = (&DAT_00001549)[unaff_A5];
  *(undefined2 *)(&DAT_0000157a + unaff_A5) = *(undefined2 *)(&DAT_00001574 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_00001549)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001574 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_00001549)[unaff_A5] + -1;
      (&DAT_00001549)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001574 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6d48 FUN_000c6d48 */

undefined1 FUN_000c6d48(void)

{
  char cVar1;
  undefined1 uVar2;
  short sVar3;
  int unaff_A5;
  
  (&DAT_00001560)[unaff_A5] = (&DAT_0000154a)[unaff_A5];
  *(undefined2 *)(&DAT_0000157c + unaff_A5) = *(undefined2 *)(&DAT_00001576 + unaff_A5);
  uVar2 = 0;
  if ((&DAT_0000154a)[unaff_A5] != '\0') {
    sVar3 = *(short *)(&DAT_00001576 + unaff_A5);
    do {
      sVar3 = sVar3 + 2;
      uVar2 = FUN_000c6e6a();
      cVar1 = (&DAT_0000154a)[unaff_A5] + -1;
      (&DAT_0000154a)[unaff_A5] = cVar1;
    } while (cVar1 != '\0');
    *(short *)(&DAT_00001576 + unaff_A5) = sVar3;
  }
  return uVar2;
}



/* 000c6d98 FUN_000c6d98 */

void FUN_000c6d98(void)

{
  byte bVar1;
  short sVar2;
  short sVar3;
  short sVar4;
  short extraout_D1w;
  short extraout_D1w_00;
  short sVar5;
  short extraout_D1w_01;
  short extraout_D1w_02;
  short extraout_D1w_03;
  short extraout_D1w_04;
  short extraout_D1w_05;
  short extraout_D1w_06;
  short extraout_D1w_07;
  ushort uVar6;
  ushort uVar7;
  short sVar8;
  ushort uVar9;
  short sVar10;
  short unaff_D7w;
  ushort *extraout_A0;
  ushort *extraout_A0_00;
  ushort *puVar11;
  ushort *extraout_A0_01;
  ushort *extraout_A0_02;
  ushort *extraout_A0_03;
  ushort *extraout_A0_04;
  ushort *extraout_A0_05;
  ushort *puVar12;
  ushort *extraout_A0_06;
  ushort *extraout_A0_07;
  char *in_A1;
  int extraout_A1;
  int extraout_A1_00;
  int extraout_A1_01;
  int iVar13;
  int extraout_A1_02;
  int extraout_A1_03;
  int extraout_A1_04;
  int extraout_A1_05;
  int extraout_A1_06;
  int extraout_A1_07;
  int extraout_A1_08;
  ushort *puVar14;
  ushort *puVar15;
  short *unaff_A3;
  short *psVar16;
  int unaff_A5;
  
  if ((((*in_A1 != '\0') && (in_A1[1] != '\0')) && (in_A1[0x1a2] != '\0')) && (in_A1[0x14c] != '\0')
     ) {
    *(undefined2 *)(unaff_A5 + -0x56e0) = *(undefined2 *)(in_A1 + 0x1a4);
    *(short *)(unaff_A5 + -0x56e0) = -*(short *)(unaff_A5 + -0x56e0);
    *(undefined2 *)(unaff_A5 + -0x56de) = *(undefined2 *)(in_A1 + 0x1a6);
    *(short *)(unaff_A5 + -0x56de) = -*(short *)(unaff_A5 + -0x56de);
    puVar12 = *(ushort **)(in_A1 + 0x1a8);
    *(undefined2 *)(unaff_A5 + -0x56d2) = 0;
    FUN_000c7400();
    iVar13 = *(int *)(extraout_A1 + 0x1a);
    uVar7 = *puVar12 & 0x7fff;
    if (((uVar7 != 0) && (uVar7 <= *(ushort *)(unaff_A5 + 700))) &&
       (*(ushort *)(unaff_A5 + 700) = *(ushort *)(unaff_A5 + 700) - uVar7, unaff_D7w != 0)) {
      uVar9 = 1;
      if (*(char *)(extraout_A1 + 0x381) != '\0') {
        uVar9 = 0x10;
      }
      uVar9 = uVar9 | puVar12[1] & 0xffe0;
      if ((puVar12[1] & 0xff00) != 0) {
        uVar7 = 1;
      }
      sVar8 = uVar7 - 1;
      puVar15 = puVar12 + 5;
      sVar4 = FUN_000c74cc();
      bVar1 = *(byte *)(iVar13 + 0x13);
      if ((bVar1 & 3) != 0) {
        uVar9 = (bVar1 & 3) << 5 ^ uVar9;
        *(short *)(unaff_A5 + -0x56de) =
             (*(ushort *)(iVar13 + 0x14) & 0xff) + *(short *)(unaff_A5 + -0x56de);
      }
      *(short *)(unaff_A5 + -0x56e0) =
           *(short *)(unaff_A5 + -0x56e0) - *(short *)(extraout_A1_00 + 0x52);
      uVar9 = (*(ushort *)(*(int *)(*(int *)(extraout_A1_00 + 0x1a) + 4) + 2) & 3) << 5 ^ uVar9;
      if ((short)*puVar12 < 0) {
        sVar5 = *(short *)(extraout_A1_00 + 0x50);
        *(undefined2 *)(unaff_A5 + -0x56d0) = *(undefined2 *)(unaff_A5 + 0x2c2);
        if (sVar5 != 0) {
          *(short *)(unaff_A5 + -0x56d0) = sVar5;
        }
        uVar7 = (*(byte *)(extraout_A1_00 + 0x12) & 3) << 5 ^ uVar9 & 0xffe0;
        if ((uVar7 & 0x20) == 0) {
          if ((uVar7 & 0x40) == 0) {
            sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
            sVar5 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w;
            puVar12 = extraout_A0;
            iVar13 = extraout_A1_00;
            if (*(char *)(extraout_A1_00 + 0x13) < '\0') {
              sVar10 = (ushort)*(byte *)(extraout_A1_00 + 0x11) << 3;
              while( true ) {
                for (; *puVar15 == 0; puVar15 = puVar15 + 2) {
                  unaff_A3 = unaff_A3 + 2;
                }
                psVar16 = unaff_A3 + 1;
                sVar2 = *unaff_A3 +
                        ((short)((*unaff_A3 + 8) * *(short *)(extraout_A1_00 + 0x16)) >> 4) + 8;
                *(short *)(unaff_A5 + -0x56c0) = sVar2;
                *puVar12 = sVar4 + (short)((uint)((int)sVar2 *
                                                 (int)*(short *)(&DAT_000c82a4 + sVar10)) >> 8);
                puVar12[1] = sVar5 + (short)((uint)((int)*(short *)(unaff_A5 + -0x56c0) *
                                                   (int)*(short *)(&DAT_000c82a6 + sVar10)) >> 8);
                unaff_A3 = unaff_A3 + 2;
                sVar3 = *psVar16 +
                        ((short)((*psVar16 + 8) * *(short *)(extraout_A1_00 + 0x16)) >> 4) + 8;
                *(short *)(unaff_A5 + -0x56be) = sVar3;
                sVar2 = *(short *)(&DAT_000c82a8 + sVar10);
                *puVar12 = *puVar12 - 8;
                puVar11 = puVar12 + 1;
                *puVar12 = (short)((uint)((int)sVar3 * (int)sVar2) >> 8) + *puVar12;
                sVar2 = *(short *)(unaff_A5 + -0x56be);
                sVar3 = *(short *)(&DAT_000c82aa + sVar10);
                *puVar11 = *puVar11 - 8;
                *puVar11 = (short)((uint)((int)sVar2 * (int)sVar3) >> 8) + *puVar11;
                puVar11 = puVar15 + 1;
                puVar12[2] = *puVar15;
                puVar15 = puVar15 + 2;
                puVar12[3] = uVar7 ^ *puVar11;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) | *puVar12;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) | puVar12[1];
                puVar12 = puVar12 + -4;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) break;
                sVar8 = sVar8 + -1;
                if (sVar8 == -1) {
                  return;
                }
              }
              return;
            }
            while( true ) {
              while( true ) {
                for (; uVar9 = *puVar15, uVar9 == 0; puVar15 = puVar15 + 2) {
                  unaff_A3 = unaff_A3 + 2;
                }
                if (uVar9 == 0xf000) break;
                if (uVar9 == 0xf200) {
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                  puVar15 = puVar15 + 3;
                }
                else if ((uVar9 & 0xff00) == 0xff00) {
                  unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                  puVar15 = puVar15 + 1;
                }
                else {
                  psVar16 = unaff_A3 + 1;
                  *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                             *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                  unaff_A3 = unaff_A3 + 2;
                  puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                               *(ushort *)(unaff_A5 + -0x56d4) &
                               *(short *)(unaff_A5 + -0x56d6) + sVar5 + *psVar16;
                  puVar14 = puVar15 + 1;
                  puVar11 = puVar12 + 3;
                  puVar12[2] = *puVar15;
                  puVar15 = puVar15 + 2;
                  uVar9 = *puVar14;
                  if (*(char *)(iVar13 + 0x22) == '\0') {
                    sVar4 = FUN_000c7b00();
                    sVar5 = extraout_D1w_00;
                    puVar11 = extraout_A0_00;
                    iVar13 = extraout_A1_01;
                  }
                  if (*(char *)(iVar13 + 0x20) == -0x71) {
                    uVar7 = uVar7 & 0xffe0;
                    uVar9 = *(ushort *)(iVar13 + 0x16) | uVar9 & 0xffe0;
                  }
                  *puVar11 = uVar7 ^ uVar9;
                  *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                  *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                  puVar12 = puVar11 + -7;
                  unaff_D7w = unaff_D7w + -1;
                  if (unaff_D7w == 0) {
                    return;
                  }
                  sVar8 = sVar8 + -1;
                  if (sVar8 == -1) {
                    return;
                  }
                }
              }
              *(ushort *)(unaff_A5 + -0x56da) = uVar7;
              uVar9 = puVar15[1] | uVar7 & 0xff;
              bVar1 = (&DAT_000c7bee)[(short)(puVar15[1] >> 8)];
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           *(short *)(unaff_A5 + -0x56d6) + sVar5 + unaff_A3[1];
              puVar11 = puVar12 + 3;
              puVar12[2] = puVar15[2];
              puVar12 = puVar15 + 4;
              uVar7 = puVar15[3];
              if (*(char *)(iVar13 + 0x22) == '\0') {
                sVar4 = FUN_000c7b00();
                sVar5 = extraout_D1w_01;
                puVar11 = extraout_A0_01;
                iVar13 = extraout_A1_02;
              }
              if (*(char *)(iVar13 + 0x20) == -0x71) {
                uVar9 = uVar9 & 0xffe0;
                uVar7 = *(ushort *)(iVar13 + 0x16) | uVar7 & 0xffe0;
              }
              *puVar11 = uVar9 ^ uVar7;
              uVar7 = *(ushort *)(unaff_A5 + -0x56da);
              puVar15 = puVar15 + 5;
              unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar11 + -7;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar8 = (sVar8 - (ushort)bVar1) + -1;
              if (sVar8 == -1) {
                return;
              }
            }
          }
          else {
            sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
            sVar5 = extraout_D1w - *(short *)(unaff_A5 + -0x56de);
            puVar12 = extraout_A0;
            iVar13 = extraout_A1_00;
            while( true ) {
              while( true ) {
                for (; uVar9 = *puVar15, uVar9 == 0; puVar15 = puVar15 + 2) {
                  unaff_A3 = unaff_A3 + 2;
                }
                if (uVar9 == 0xf000) break;
                if (uVar9 == 0xf200) {
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                  puVar15 = puVar15 + 3;
                }
                else if ((uVar9 & 0xff00) == 0xff00) {
                  unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                  puVar15 = puVar15 + 1;
                }
                else {
                  psVar16 = unaff_A3 + 1;
                  *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                             *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                  unaff_A3 = unaff_A3 + 2;
                  puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                               *(ushort *)(unaff_A5 + -0x56d4) &
                               (sVar5 + (-0x10 - *psVar16)) - *(short *)(unaff_A5 + -0x56d6);
                  puVar14 = puVar15 + 1;
                  puVar11 = puVar12 + 3;
                  puVar12[2] = *puVar15;
                  puVar15 = puVar15 + 2;
                  uVar9 = *puVar14;
                  if (*(char *)(iVar13 + 0x22) == '\0') {
                    sVar4 = FUN_000c7b00();
                    sVar5 = extraout_D1w_04;
                    puVar11 = extraout_A0_04;
                    iVar13 = extraout_A1_05;
                  }
                  if (*(char *)(iVar13 + 0x20) == -0x71) {
                    uVar7 = uVar7 & 0xffe0;
                    uVar9 = *(ushort *)(iVar13 + 0x16) | uVar9 & 0xffe0;
                  }
                  *puVar11 = uVar7 ^ uVar9;
                  *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                  *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                  puVar12 = puVar11 + -7;
                  unaff_D7w = unaff_D7w + -1;
                  if (unaff_D7w == 0) {
                    return;
                  }
                  sVar8 = sVar8 + -1;
                  if (sVar8 == -1) {
                    return;
                  }
                }
              }
              *(ushort *)(unaff_A5 + -0x56da) = uVar7;
              uVar9 = puVar15[1];
              uVar6 = uVar9 | uVar7 & 0xff;
              bVar1 = (&DAT_000c7bee)[(short)(uVar9 >> 8)];
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           (sVar5 + (-(((uVar9 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                           *(short *)(unaff_A5 + -0x56d6);
              puVar11 = puVar12 + 3;
              puVar12[2] = puVar15[2];
              puVar12 = puVar15 + 4;
              uVar7 = puVar15[3];
              if (*(char *)(iVar13 + 0x22) == '\0') {
                sVar4 = FUN_000c7b00();
                sVar5 = extraout_D1w_05;
                puVar11 = extraout_A0_05;
                iVar13 = extraout_A1_06;
              }
              if (*(char *)(iVar13 + 0x20) == -0x71) {
                uVar6 = uVar6 & 0xffe0;
                uVar7 = *(ushort *)(iVar13 + 0x16) | uVar7 & 0xffe0;
              }
              *puVar11 = uVar6 ^ uVar7;
              uVar7 = *(ushort *)(unaff_A5 + -0x56da);
              puVar15 = puVar15 + 5;
              unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar11 + -7;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar8 = (sVar8 - (ushort)bVar1) + -1;
              if (sVar8 == -1) {
                return;
              }
            }
          }
        }
        else if ((uVar7 & 0x40) == 0) {
          sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
          sVar5 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w;
          puVar12 = extraout_A0;
          iVar13 = extraout_A1_00;
          while( true ) {
            while( true ) {
              for (; uVar9 = *puVar15, uVar9 == 0; puVar15 = puVar15 + 2) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar9 == 0xf000) break;
              if (uVar9 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                puVar15 = puVar15 + 3;
              }
              else if ((uVar9 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                puVar15 = puVar15 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           (sVar4 + (-0x10 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             *(short *)(unaff_A5 + -0x56d6) + sVar5 + *psVar16;
                puVar14 = puVar15 + 1;
                puVar11 = puVar12 + 3;
                puVar12[2] = *puVar15;
                puVar15 = puVar15 + 2;
                uVar9 = *puVar14;
                if (*(char *)(iVar13 + 0x22) == '\0') {
                  sVar4 = FUN_000c7b00();
                  sVar5 = extraout_D1w_02;
                  puVar11 = extraout_A0_02;
                  iVar13 = extraout_A1_03;
                }
                if (*(char *)(iVar13 + 0x20) == -0x71) {
                  uVar7 = uVar7 & 0xffe0;
                  uVar9 = *(ushort *)(iVar13 + 0x16) | uVar9 & 0xffe0;
                }
                *puVar11 = uVar7 ^ uVar9;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar11 + -7;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar8 = sVar8 + -1;
                if (sVar8 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar7;
            uVar9 = puVar15[1];
            uVar6 = uVar9 | uVar7 & 0xff;
            bVar1 = (&DAT_000c7bee)[(short)(uVar9 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       (sVar4 + (-(((uVar9 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                       *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         *(short *)(unaff_A5 + -0x56d6) + sVar5 + unaff_A3[1];
            puVar11 = puVar12 + 3;
            puVar12[2] = puVar15[2];
            puVar12 = puVar15 + 4;
            uVar7 = puVar15[3];
            if (*(char *)(iVar13 + 0x22) == '\0') {
              sVar4 = FUN_000c7b00();
              sVar5 = extraout_D1w_03;
              puVar11 = extraout_A0_03;
              iVar13 = extraout_A1_04;
            }
            if (*(char *)(iVar13 + 0x20) == -0x71) {
              uVar6 = uVar6 & 0xffe0;
              uVar7 = *(ushort *)(iVar13 + 0x16) | uVar7 & 0xffe0;
            }
            *puVar11 = uVar6 ^ uVar7;
            uVar7 = *(ushort *)(unaff_A5 + -0x56da);
            puVar15 = puVar15 + 5;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar11 + -7;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar8 = (sVar8 - (ushort)bVar1) + -1;
            if (sVar8 == -1) {
              return;
            }
          }
        }
        else {
          sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
          sVar5 = extraout_D1w - *(short *)(unaff_A5 + -0x56de);
          puVar12 = extraout_A0;
          iVar13 = extraout_A1_00;
          while( true ) {
            while( true ) {
              for (; uVar9 = *puVar15, uVar9 == 0; puVar15 = puVar15 + 2) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar9 == 0xf000) break;
              if (uVar9 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                puVar15 = puVar15 + 3;
              }
              else if ((uVar9 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                puVar15 = puVar15 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           (sVar4 + (-0x10 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             (sVar5 + (-0x10 - *psVar16)) - *(short *)(unaff_A5 + -0x56d6);
                puVar14 = puVar15 + 1;
                puVar11 = puVar12 + 3;
                puVar12[2] = *puVar15;
                puVar15 = puVar15 + 2;
                uVar9 = *puVar14;
                if (*(char *)(iVar13 + 0x22) == '\0') {
                  sVar4 = FUN_000c7b00();
                  sVar5 = extraout_D1w_06;
                  puVar11 = extraout_A0_06;
                  iVar13 = extraout_A1_07;
                }
                if (*(char *)(iVar13 + 0x20) == -0x71) {
                  uVar7 = uVar7 & 0xffe0;
                  uVar9 = *(ushort *)(iVar13 + 0x16) | uVar9 & 0xffe0;
                }
                *puVar11 = uVar7 ^ uVar9;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar11 + -7;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar8 = sVar8 + -1;
                if (sVar8 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar7;
            uVar9 = puVar15[1];
            uVar6 = uVar9 | uVar7 & 0xff;
            bVar1 = (&DAT_000c7bee)[(short)(uVar9 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       (sVar4 + (-(((uVar9 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                       *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         (sVar5 + (-(((uVar9 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                         *(short *)(unaff_A5 + -0x56d6);
            puVar11 = puVar12 + 3;
            puVar12[2] = puVar15[2];
            puVar12 = puVar15 + 4;
            uVar7 = puVar15[3];
            if (*(char *)(iVar13 + 0x22) == '\0') {
              sVar4 = FUN_000c7b00();
              sVar5 = extraout_D1w_07;
              puVar11 = extraout_A0_07;
              iVar13 = extraout_A1_08;
            }
            if (*(char *)(iVar13 + 0x20) == -0x71) {
              uVar6 = uVar6 & 0xffe0;
              uVar7 = *(ushort *)(iVar13 + 0x16) | uVar7 & 0xffe0;
            }
            *puVar11 = uVar6 ^ uVar7;
            uVar7 = *(ushort *)(unaff_A5 + -0x56da);
            puVar15 = puVar15 + 5;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar11 + -7;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar8 = (sVar8 - (ushort)bVar1) + -1;
            if (sVar8 == -1) {
              return;
            }
          }
        }
      }
      else {
        sVar5 = *(short *)(extraout_A1_00 + 0x50);
        *(undefined2 *)(unaff_A5 + -0x56d0) = *(undefined2 *)(unaff_A5 + 0x2c2);
        if (sVar5 != 0) {
          *(short *)(unaff_A5 + -0x56d0) = sVar5;
        }
        if ((*(char *)(extraout_A1_00 + 0x13) != '\0') && (-1 < *(char *)(extraout_A1_00 + 0x13))) {
          uVar9 = *(ushort *)(extraout_A1_00 + 0x16) | uVar9 & 0xffe0;
        }
        uVar9 = (*(byte *)(extraout_A1_00 + 0x12) & 3) << 5 ^ uVar9;
        if ((uVar9 & 0x20) == 0) {
          if ((uVar9 & 0x40) == 0) {
            sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
            sVar5 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w;
            puVar12 = extraout_A0;
            if (*(char *)(extraout_A1_00 + 0x13) < '\0') {
              sVar10 = (ushort)*(byte *)(extraout_A1_00 + 0x11) << 3;
              while( true ) {
                for (; *puVar15 == 0; puVar15 = puVar15 + 1) {
                  unaff_A3 = unaff_A3 + 2;
                }
                sVar2 = *(short *)(extraout_A1_00 + 0x16);
                psVar16 = unaff_A3 + 1;
                sVar3 = *unaff_A3 + ((short)((*unaff_A3 + 8) * sVar2) >> 4) + 8;
                *(short *)(unaff_A5 + -0x56c0) = sVar3;
                *puVar12 = sVar4 + (short)((uint)((int)sVar3 *
                                                 (int)*(short *)(&DAT_000c82a4 + sVar10)) >> 8);
                puVar12[1] = sVar5 + (short)((uint)((int)*(short *)(unaff_A5 + -0x56c0) *
                                                   (int)*(short *)(&DAT_000c82a6 + sVar10)) >> 8);
                unaff_A3 = unaff_A3 + 2;
                sVar3 = *psVar16 + ((short)((*psVar16 + 8) * sVar2) >> 4) + 8;
                *(short *)(unaff_A5 + -0x56be) = sVar3;
                sVar2 = *(short *)(&DAT_000c82a8 + sVar10);
                *puVar12 = *puVar12 - 8;
                puVar11 = puVar12 + 1;
                *puVar12 = (short)((uint)((int)sVar3 * (int)sVar2) >> 8) + *puVar12;
                sVar2 = *(short *)(unaff_A5 + -0x56be);
                sVar3 = *(short *)(&DAT_000c82aa + sVar10);
                *puVar11 = *puVar11 - 8;
                *puVar11 = (short)((uint)((int)sVar2 * (int)sVar3) >> 8) + *puVar11;
                if (0x1ff < *puVar12) {
                  *puVar12 = 0;
                }
                if (0x1ff < puVar12[1]) {
                  puVar12[1] = 0;
                }
                puVar12[2] = *puVar15;
                puVar12[3] = uVar9;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) | *puVar12;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) | puVar12[1];
                puVar12 = puVar12 + -4;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) break;
                sVar8 = sVar8 + -1;
                puVar15 = puVar15 + 1;
                if (sVar8 == -1) {
                  return;
                }
              }
              return;
            }
            do {
              while( true ) {
                while( true ) {
                  while( true ) {
                    for (; uVar7 = *puVar15, uVar7 == 0; puVar15 = puVar15 + 1) {
                      unaff_A3 = unaff_A3 + 2;
                    }
                    if (uVar7 != 0xf000) break;
                    *(ushort *)(unaff_A5 + -0x56da) = uVar9;
                    uVar7 = puVar15[1];
                    bVar1 = (&DAT_000c7bee)[(short)(uVar7 >> 8)];
                    *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                               *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                    puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                                 *(ushort *)(unaff_A5 + -0x56d4) &
                                 *(short *)(unaff_A5 + -0x56d6) + sVar5 + unaff_A3[1];
                    puVar11 = puVar15 + 3;
                    puVar12[2] = puVar15[2];
                    puVar12[3] = uVar7 | uVar9 & 0xff;
                    uVar9 = *(ushort *)(unaff_A5 + -0x56da);
                    puVar15 = puVar15 + 4;
                    unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
                    *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                    *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                    puVar12 = puVar12 + -4;
                    unaff_D7w = unaff_D7w + -1;
                    if (unaff_D7w == 0) {
                      return;
                    }
                    sVar8 = (sVar8 - (ushort)bVar1) + -1;
                    if (sVar8 == -1) {
                      return;
                    }
                  }
                  if (uVar7 != 0xf200) break;
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                  puVar15 = puVar15 + 3;
                }
                if ((uVar7 & 0xff00) != 0xff00) break;
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                puVar15 = puVar15 + 1;
              }
              psVar16 = unaff_A3 + 1;
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
              unaff_A3 = unaff_A3 + 2;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           *(short *)(unaff_A5 + -0x56d6) + sVar5 + *psVar16;
              puVar12[2] = *puVar15;
              puVar12[3] = uVar9;
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar12 + -4;
              unaff_D7w = unaff_D7w + -1;
            } while ((unaff_D7w != 0) && (sVar8 = sVar8 + -1, puVar15 = puVar15 + 1, sVar8 != -1));
          }
          else {
            sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
            sVar5 = extraout_D1w - *(short *)(unaff_A5 + -0x56de);
            uVar7 = uVar9 & 0xf000;
            puVar12 = extraout_A0;
            while( true ) {
              while( true ) {
                for (; uVar6 = *puVar15, uVar6 == 0; puVar15 = puVar15 + 1) {
                  unaff_A3 = unaff_A3 + 2;
                }
                if (uVar6 == 0xf000) break;
                if (uVar6 == 0xf200) {
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                  puVar15 = puVar15 + 3;
                }
                else if ((uVar6 & 0xff00) == 0xff00) {
                  unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                  puVar15 = puVar15 + 1;
                }
                else {
                  psVar16 = unaff_A3 + 1;
                  *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                             *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                  unaff_A3 = unaff_A3 + 2;
                  puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                               *(ushort *)(unaff_A5 + -0x56d4) &
                               (sVar5 + (-((uVar7 >> 8) + 0x10) - *psVar16)) -
                               *(short *)(unaff_A5 + -0x56d6);
                  puVar12[2] = *puVar15;
                  puVar12[3] = uVar9;
                  *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                  *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                  puVar12 = puVar12 + -4;
                  unaff_D7w = unaff_D7w + -1;
                  if (unaff_D7w == 0) {
                    return;
                  }
                  sVar8 = sVar8 + -1;
                  puVar15 = puVar15 + 1;
                  if (sVar8 == -1) {
                    return;
                  }
                }
              }
              *(ushort *)(unaff_A5 + -0x56da) = uVar9;
              uVar6 = puVar15[1];
              bVar1 = (&DAT_000c7bee)[(short)(uVar6 >> 8)];
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           (sVar5 + (-(((uVar6 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                           *(short *)(unaff_A5 + -0x56d6);
              puVar11 = puVar15 + 3;
              puVar12[2] = puVar15[2];
              puVar12[3] = uVar6 | uVar9 & 0xff;
              uVar9 = *(ushort *)(unaff_A5 + -0x56da);
              puVar15 = puVar15 + 4;
              unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar12 + -4;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar8 = (sVar8 - (ushort)bVar1) + -1;
              if (sVar8 == -1) {
                return;
              }
            }
          }
        }
        else {
          sVar5 = ((uVar9 & 0xf00) >> 4) + 0x10;
          if ((uVar9 & 0x40) == 0) {
            sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
            sVar10 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w;
            puVar12 = extraout_A0;
            while( true ) {
              while( true ) {
                for (; uVar7 = *puVar15, uVar7 == 0; puVar15 = puVar15 + 1) {
                  unaff_A3 = unaff_A3 + 2;
                }
                if (uVar7 == 0xf000) break;
                if (uVar7 == 0xf200) {
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                  puVar15 = puVar15 + 3;
                }
                else if ((uVar7 & 0xff00) == 0xff00) {
                  unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                  puVar15 = puVar15 + 1;
                }
                else {
                  psVar16 = unaff_A3 + 1;
                  *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                             (sVar4 + (-sVar5 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) &
                             0x3ffU;
                  unaff_A3 = unaff_A3 + 2;
                  puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                               *(ushort *)(unaff_A5 + -0x56d4) &
                               *(short *)(unaff_A5 + -0x56d6) + sVar10 + *psVar16;
                  puVar12[2] = *puVar15;
                  puVar12[3] = uVar9;
                  *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                  *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                  puVar12 = puVar12 + -4;
                  unaff_D7w = unaff_D7w + -1;
                  if (unaff_D7w == 0) {
                    return;
                  }
                  sVar8 = sVar8 + -1;
                  puVar15 = puVar15 + 1;
                  if (sVar8 == -1) {
                    return;
                  }
                }
              }
              *(ushort *)(unaff_A5 + -0x56da) = uVar9;
              uVar7 = puVar15[1];
              bVar1 = (&DAT_000c7bee)[(short)(uVar7 >> 8)];
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         (sVar4 + (-(((uVar7 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                         *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           *(short *)(unaff_A5 + -0x56d6) + sVar10 + unaff_A3[1];
              puVar11 = puVar15 + 3;
              puVar12[2] = puVar15[2];
              puVar12[3] = uVar7 | uVar9 & 0xff;
              uVar9 = *(ushort *)(unaff_A5 + -0x56da);
              puVar15 = puVar15 + 4;
              unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar12 + -4;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar8 = (sVar8 - (ushort)bVar1) + -1;
              if (sVar8 == -1) {
                return;
              }
            }
          }
          else {
            sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
            sVar10 = extraout_D1w - *(short *)(unaff_A5 + -0x56de);
            uVar7 = uVar9 & 0xf000;
            puVar12 = extraout_A0;
            while( true ) {
              while( true ) {
                for (; uVar6 = *puVar15, uVar6 == 0; puVar15 = puVar15 + 1) {
                  unaff_A3 = unaff_A3 + 2;
                }
                if (uVar6 == 0xf000) break;
                if (uVar6 == 0xf200) {
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar15[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar15[2];
                  puVar15 = puVar15 + 3;
                }
                else if ((uVar6 & 0xff00) == 0xff00) {
                  unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar15 & 0xff) << 2));
                  puVar15 = puVar15 + 1;
                }
                else {
                  psVar16 = unaff_A3 + 1;
                  *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                             (sVar4 + (-sVar5 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) &
                             0x3ffU;
                  unaff_A3 = unaff_A3 + 2;
                  puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                               *(ushort *)(unaff_A5 + -0x56d4) &
                               (sVar10 + (-((uVar7 >> 8) + 0x10) - *psVar16)) -
                               *(short *)(unaff_A5 + -0x56d6);
                  puVar12[2] = *puVar15;
                  puVar12[3] = uVar9;
                  *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                  *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                  puVar12 = puVar12 + -4;
                  unaff_D7w = unaff_D7w + -1;
                  if (unaff_D7w == 0) {
                    return;
                  }
                  sVar8 = sVar8 + -1;
                  puVar15 = puVar15 + 1;
                  if (sVar8 == -1) {
                    return;
                  }
                }
              }
              *(ushort *)(unaff_A5 + -0x56da) = uVar9;
              uVar6 = puVar15[1];
              bVar1 = (&DAT_000c7bee)[(short)(uVar6 >> 8)];
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         (sVar4 + (-(((uVar6 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                         *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           (sVar10 + (-(((uVar6 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                           *(short *)(unaff_A5 + -0x56d6);
              puVar11 = puVar15 + 3;
              puVar12[2] = puVar15[2];
              puVar12[3] = uVar6 | uVar9 & 0xff;
              uVar9 = *(ushort *)(unaff_A5 + -0x56da);
              puVar15 = puVar15 + 4;
              unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar12 + -4;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar8 = (sVar8 - (ushort)bVar1) + -1;
              if (sVar8 == -1) {
                return;
              }
            }
          }
        }
      }
    }
  }
  return;
}



/* 000c6e6a FUN_000c6e6a */

void FUN_000c6e6a(void)

{
  short sVar1;
  byte bVar2;
  short sVar3;
  short sVar4;
  short extraout_D1w;
  short extraout_D1w_00;
  short extraout_D1w_01;
  short sVar5;
  short extraout_D1w_02;
  short extraout_D1w_03;
  short extraout_D1w_04;
  short extraout_D1w_05;
  short extraout_D1w_06;
  short extraout_D1w_07;
  short extraout_D1w_08;
  ushort uVar6;
  ushort uVar7;
  ushort uVar8;
  short sVar9;
  short sVar10;
  short unaff_D7w;
  ushort *extraout_A0;
  ushort *extraout_A0_00;
  ushort *extraout_A0_01;
  ushort *puVar11;
  ushort *extraout_A0_02;
  ushort *extraout_A0_03;
  ushort *extraout_A0_04;
  ushort *extraout_A0_05;
  ushort *extraout_A0_06;
  ushort *extraout_A0_07;
  ushort *extraout_A0_08;
  ushort *puVar12;
  int extraout_A1;
  int extraout_A1_00;
  int extraout_A1_01;
  int extraout_A1_02;
  int iVar13;
  int extraout_A1_03;
  int extraout_A1_04;
  int extraout_A1_05;
  int extraout_A1_06;
  int extraout_A1_07;
  int extraout_A1_08;
  int extraout_A1_09;
  ushort *puVar14;
  ushort *puVar15;
  short *unaff_A3;
  short *psVar16;
  int unaff_A5;
  
  if ((*(char *)(unaff_A5 + 0x2e3) != '\0') && ((*(byte *)(unaff_A5 + 0x92) & 2) != 0)) {
    FUN_000c845a();
  }
  FUN_000c7400();
  puVar14 = *(ushort **)(*(int *)(extraout_A1 + 0x1a) + 4);
  uVar8 = *puVar14;
  if (uVar8 != 0) {
    if ((short)uVar8 < 0) {
      uVar8 = uVar8 & 0x7fff;
      if (*(ushort *)(unaff_A5 + 700) < uVar8) {
        return;
      }
      *(ushort *)(unaff_A5 + 700) = *(ushort *)(unaff_A5 + 700) - uVar8;
      if (unaff_D7w != 0) {
        sVar9 = uVar8 - 1;
        uVar8 = puVar14[1] & 0xe0;
        puVar12 = puVar14 + 3;
        sVar4 = FUN_000c74cc();
        *(undefined2 *)(unaff_A5 + -0x56d2) = 0;
        if (*puVar12 == 0x3fff) {
          *(undefined2 *)(unaff_A5 + -0x56d2) = 0x2000;
          puVar12 = puVar14 + 4;
        }
        *(ushort *)(unaff_A5 + -0x56e0) = *puVar12;
        *(ushort *)(unaff_A5 + -0x56de) = puVar12[1];
        iVar13 = *(int *)(extraout_A1_01 + 0x1a);
        if ((*(byte *)(iVar13 + 0x13) & 3) != 0) {
          uVar8 = (*(byte *)(iVar13 + 0x13) & 3) << 5 ^ uVar8;
          *(short *)(unaff_A5 + -0x56de) =
               (ushort)*(byte *)(iVar13 + 0x14) + *(short *)(unaff_A5 + -0x56de);
        }
        puVar14 = (ushort *)(*(int *)(iVar13 + 4) + 10);
        if (*(short *)(unaff_A5 + -0x56d2) != 0) {
          puVar14 = (ushort *)(*(int *)(iVar13 + 4) + 0xc);
        }
        *(short *)(unaff_A5 + -0x56e0) =
             *(short *)(unaff_A5 + -0x56e0) - *(short *)(extraout_A1_01 + 0x52);
        if (((*(char *)(extraout_A1_01 + 0x22) != '\0') &&
            (*(char *)(extraout_A1_01 + 0x13) != '\0')) && (-1 < *(char *)(extraout_A1_01 + 0x13)))
        {
          uVar8 = *(ushort *)(extraout_A1_01 + 0x16) | uVar8;
        }
        sVar5 = *(short *)(extraout_A1_01 + 0x50);
        *(undefined2 *)(unaff_A5 + -0x56d0) = *(undefined2 *)(unaff_A5 + 0x2c2);
        if (sVar5 != 0) {
          *(short *)(unaff_A5 + -0x56d0) = sVar5;
        }
        uVar8 = (*(byte *)(extraout_A1_01 + 0x12) & 3) << 5 ^ uVar8;
        if ((uVar8 & 0x20) == 0) {
          if ((uVar8 & 0x40) == 0) {
            sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
            sVar5 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w_00;
            puVar12 = extraout_A0_00;
            iVar13 = extraout_A1_01;
            if (*(char *)(extraout_A1_01 + 0x13) < '\0') {
              sVar10 = (ushort)*(byte *)(extraout_A1_01 + 0x11) << 3;
              while( true ) {
                for (; *puVar14 == 0; puVar14 = puVar14 + 2) {
                  unaff_A3 = unaff_A3 + 2;
                }
                psVar16 = unaff_A3 + 1;
                sVar1 = *unaff_A3 +
                        ((short)((*unaff_A3 + 8) * *(short *)(extraout_A1_01 + 0x16)) >> 4) + 8;
                *(short *)(unaff_A5 + -0x56c0) = sVar1;
                *puVar12 = sVar4 + (short)((uint)((int)sVar1 *
                                                 (int)*(short *)(&DAT_000c82a4 + sVar10)) >> 8);
                puVar12[1] = sVar5 + (short)((uint)((int)*(short *)(unaff_A5 + -0x56c0) *
                                                   (int)*(short *)(&DAT_000c82a6 + sVar10)) >> 8);
                unaff_A3 = unaff_A3 + 2;
                sVar3 = *psVar16 +
                        ((short)((*psVar16 + 8) * *(short *)(extraout_A1_01 + 0x16)) >> 4) + 8;
                *(short *)(unaff_A5 + -0x56be) = sVar3;
                sVar1 = *(short *)(&DAT_000c82a8 + sVar10);
                *puVar12 = *puVar12 - 8;
                puVar11 = puVar12 + 1;
                *puVar12 = (short)((uint)((int)sVar3 * (int)sVar1) >> 8) + *puVar12;
                sVar1 = *(short *)(unaff_A5 + -0x56be);
                sVar3 = *(short *)(&DAT_000c82aa + sVar10);
                *puVar11 = *puVar11 - 8;
                *puVar11 = (short)((uint)((int)sVar1 * (int)sVar3) >> 8) + *puVar11;
                puVar11 = puVar14 + 1;
                puVar12[2] = *puVar14;
                puVar14 = puVar14 + 2;
                puVar12[3] = uVar8 ^ *puVar11;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) | *puVar12;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) | puVar12[1];
                puVar12 = puVar12 + -4;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) break;
                sVar9 = sVar9 + -1;
                if (sVar9 == -1) {
                  return;
                }
              }
              return;
            }
            while( true ) {
              while( true ) {
                while( true ) {
                  while( true ) {
                    for (; uVar6 = *puVar14, uVar6 == 0; puVar14 = puVar14 + 2) {
                      unaff_A3 = unaff_A3 + 2;
                    }
                    if (uVar6 != 0xf000) break;
                    *(ushort *)(unaff_A5 + -0x56da) = uVar8;
                    uVar6 = puVar14[1] | uVar8 & 0xff;
                    bVar2 = (&DAT_000c7bee)[(short)(puVar14[1] >> 8)];
                    *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                               *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                    puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                                 *(ushort *)(unaff_A5 + -0x56d4) &
                                 *(short *)(unaff_A5 + -0x56d6) + sVar5 + unaff_A3[1];
                    puVar11 = puVar12 + 3;
                    puVar12[2] = puVar14[2];
                    puVar12 = puVar14 + 4;
                    uVar8 = puVar14[3];
                    if (*(char *)(iVar13 + 0x22) == '\0') {
                      sVar4 = FUN_000c7b00();
                      sVar5 = extraout_D1w_02;
                      puVar11 = extraout_A0_02;
                      iVar13 = extraout_A1_03;
                    }
                    if (*(char *)(iVar13 + 0x20) == -0x71) {
                      uVar6 = uVar6 & 0xffe0;
                      uVar8 = *(ushort *)(iVar13 + 0x16) | uVar8 & 0xffe0;
                    }
                    *puVar11 = uVar6 ^ uVar8;
                    uVar8 = *(ushort *)(unaff_A5 + -0x56da);
                    puVar14 = puVar14 + 5;
                    unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
                    *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                    *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                    puVar12 = puVar11 + -7;
                    unaff_D7w = unaff_D7w + -1;
                    if (unaff_D7w == 0) {
                      return;
                    }
                    sVar9 = (sVar9 - (ushort)bVar2) + -1;
                    if (sVar9 == -1) {
                      return;
                    }
                  }
                  if (uVar6 != 0xf200) break;
                  *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                  *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                  puVar14 = puVar14 + 3;
                }
                if ((uVar6 & 0xff00) != 0xff00) break;
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              psVar16 = unaff_A3 + 1;
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                         *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
              unaff_A3 = unaff_A3 + 2;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                           *(ushort *)(unaff_A5 + -0x56d4) &
                           *(short *)(unaff_A5 + -0x56d6) + sVar5 + *psVar16;
              puVar15 = puVar14 + 1;
              puVar11 = puVar12 + 3;
              puVar12[2] = *puVar14;
              puVar14 = puVar14 + 2;
              uVar6 = *puVar15;
              if (*(char *)(iVar13 + 0x22) == '\0') {
                sVar4 = FUN_000c7b00();
                sVar5 = extraout_D1w_01;
                puVar11 = extraout_A0_01;
                iVar13 = extraout_A1_02;
              }
              if (*(char *)(iVar13 + 0x20) == -0x71) {
                uVar8 = uVar8 & 0xffe0;
                uVar6 = *(ushort *)(iVar13 + 0x16) | uVar6 & 0xffe0;
              }
              *puVar11 = uVar8 ^ uVar6;
              *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
              *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
              puVar12 = puVar11 + -7;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar9 = sVar9 + -1;
              if (sVar9 == -1) {
                return;
              }
            }
            return;
          }
          sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
          sVar5 = extraout_D1w_00 - *(short *)(unaff_A5 + -0x56de);
          puVar12 = extraout_A0_00;
          iVar13 = extraout_A1_01;
          while( true ) {
            while( true ) {
              for (; uVar6 = *puVar14, uVar6 == 0; puVar14 = puVar14 + 2) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar6 == 0xf000) break;
              if (uVar6 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              else if ((uVar6 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             (sVar5 + (-0x10 - *psVar16)) - *(short *)(unaff_A5 + -0x56d6);
                puVar15 = puVar14 + 1;
                puVar11 = puVar12 + 3;
                puVar12[2] = *puVar14;
                puVar14 = puVar14 + 2;
                uVar6 = *puVar15;
                if (*(char *)(iVar13 + 0x22) == '\0') {
                  sVar4 = FUN_000c7b00();
                  sVar5 = extraout_D1w_05;
                  puVar11 = extraout_A0_05;
                  iVar13 = extraout_A1_06;
                }
                if (*(char *)(iVar13 + 0x20) == -0x71) {
                  uVar8 = uVar8 & 0xffe0;
                  uVar6 = *(ushort *)(iVar13 + 0x16) | uVar6 & 0xffe0;
                }
                *puVar11 = uVar8 ^ uVar6;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar11 + -7;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar9 = sVar9 + -1;
                if (sVar9 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar8;
            uVar6 = puVar14[1];
            uVar7 = uVar6 | uVar8 & 0xff;
            bVar2 = (&DAT_000c7bee)[(short)(uVar6 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         (sVar5 + (-(((uVar6 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                         *(short *)(unaff_A5 + -0x56d6);
            puVar11 = puVar12 + 3;
            puVar12[2] = puVar14[2];
            puVar12 = puVar14 + 4;
            uVar8 = puVar14[3];
            if (*(char *)(iVar13 + 0x22) == '\0') {
              sVar4 = FUN_000c7b00();
              sVar5 = extraout_D1w_06;
              puVar11 = extraout_A0_06;
              iVar13 = extraout_A1_07;
            }
            if (*(char *)(iVar13 + 0x20) == -0x71) {
              uVar7 = uVar7 & 0xffe0;
              uVar8 = *(ushort *)(iVar13 + 0x16) | uVar8 & 0xffe0;
            }
            *puVar11 = uVar7 ^ uVar8;
            uVar8 = *(ushort *)(unaff_A5 + -0x56da);
            puVar14 = puVar14 + 5;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar11 + -7;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar9 = (sVar9 - (ushort)bVar2) + -1;
            if (sVar9 == -1) {
              return;
            }
          }
        }
        else if ((uVar8 & 0x40) == 0) {
          sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
          sVar5 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w_00;
          puVar12 = extraout_A0_00;
          iVar13 = extraout_A1_01;
          while( true ) {
            while( true ) {
              for (; uVar6 = *puVar14, uVar6 == 0; puVar14 = puVar14 + 2) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar6 == 0xf000) break;
              if (uVar6 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              else if ((uVar6 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           (sVar4 + (-0x10 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             *(short *)(unaff_A5 + -0x56d6) + sVar5 + *psVar16;
                puVar15 = puVar14 + 1;
                puVar11 = puVar12 + 3;
                puVar12[2] = *puVar14;
                puVar14 = puVar14 + 2;
                uVar6 = *puVar15;
                if (*(char *)(iVar13 + 0x22) == '\0') {
                  sVar4 = FUN_000c7b00();
                  sVar5 = extraout_D1w_03;
                  puVar11 = extraout_A0_03;
                  iVar13 = extraout_A1_04;
                }
                if (*(char *)(iVar13 + 0x20) == -0x71) {
                  uVar8 = uVar8 & 0xffe0;
                  uVar6 = *(ushort *)(iVar13 + 0x16) | uVar6 & 0xffe0;
                }
                *puVar11 = uVar8 ^ uVar6;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar11 + -7;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar9 = sVar9 + -1;
                if (sVar9 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar8;
            uVar6 = puVar14[1];
            uVar7 = uVar6 | uVar8 & 0xff;
            bVar2 = (&DAT_000c7bee)[(short)(uVar6 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       (sVar4 + (-(((uVar6 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                       *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         *(short *)(unaff_A5 + -0x56d6) + sVar5 + unaff_A3[1];
            puVar11 = puVar12 + 3;
            puVar12[2] = puVar14[2];
            puVar12 = puVar14 + 4;
            uVar8 = puVar14[3];
            if (*(char *)(iVar13 + 0x22) == '\0') {
              sVar4 = FUN_000c7b00();
              sVar5 = extraout_D1w_04;
              puVar11 = extraout_A0_04;
              iVar13 = extraout_A1_05;
            }
            if (*(char *)(iVar13 + 0x20) == -0x71) {
              uVar7 = uVar7 & 0xffe0;
              uVar8 = *(ushort *)(iVar13 + 0x16) | uVar8 & 0xffe0;
            }
            *puVar11 = uVar7 ^ uVar8;
            uVar8 = *(ushort *)(unaff_A5 + -0x56da);
            puVar14 = puVar14 + 5;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar11 + -7;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar9 = (sVar9 - (ushort)bVar2) + -1;
            if (sVar9 == -1) {
              return;
            }
          }
        }
        else {
          sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
          sVar5 = extraout_D1w_00 - *(short *)(unaff_A5 + -0x56de);
          puVar12 = extraout_A0_00;
          iVar13 = extraout_A1_01;
          while( true ) {
            while( true ) {
              for (; uVar6 = *puVar14, uVar6 == 0; puVar14 = puVar14 + 2) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar6 == 0xf000) break;
              if (uVar6 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              else if ((uVar6 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           (sVar4 + (-0x10 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             (sVar5 + (-0x10 - *psVar16)) - *(short *)(unaff_A5 + -0x56d6);
                puVar15 = puVar14 + 1;
                puVar11 = puVar12 + 3;
                puVar12[2] = *puVar14;
                puVar14 = puVar14 + 2;
                uVar6 = *puVar15;
                if (*(char *)(iVar13 + 0x22) == '\0') {
                  sVar4 = FUN_000c7b00();
                  sVar5 = extraout_D1w_07;
                  puVar11 = extraout_A0_07;
                  iVar13 = extraout_A1_08;
                }
                if (*(char *)(iVar13 + 0x20) == -0x71) {
                  uVar8 = uVar8 & 0xffe0;
                  uVar6 = *(ushort *)(iVar13 + 0x16) | uVar6 & 0xffe0;
                }
                *puVar11 = uVar8 ^ uVar6;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar11 + -7;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar9 = sVar9 + -1;
                if (sVar9 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar8;
            uVar6 = puVar14[1];
            uVar7 = uVar6 | uVar8 & 0xff;
            bVar2 = (&DAT_000c7bee)[(short)(uVar6 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       (sVar4 + (-(((uVar6 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                       *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         (sVar5 + (-(((uVar6 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                         *(short *)(unaff_A5 + -0x56d6);
            puVar11 = puVar12 + 3;
            puVar12[2] = puVar14[2];
            puVar12 = puVar14 + 4;
            uVar8 = puVar14[3];
            if (*(char *)(iVar13 + 0x22) == '\0') {
              sVar4 = FUN_000c7b00();
              sVar5 = extraout_D1w_08;
              puVar11 = extraout_A0_08;
              iVar13 = extraout_A1_09;
            }
            if (*(char *)(iVar13 + 0x20) == -0x71) {
              uVar7 = uVar7 & 0xffe0;
              uVar8 = *(ushort *)(iVar13 + 0x16) | uVar8 & 0xffe0;
            }
            *puVar11 = uVar7 ^ uVar8;
            uVar8 = *(ushort *)(unaff_A5 + -0x56da);
            puVar14 = puVar14 + 5;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar12 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar11 + -7;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar9 = (sVar9 - (ushort)bVar2) + -1;
            if (sVar9 == -1) {
              return;
            }
          }
        }
      }
    }
    else if ((uVar8 <= *(ushort *)(unaff_A5 + 700)) &&
            (*(ushort *)(unaff_A5 + 700) = *(ushort *)(unaff_A5 + 700) - uVar8, unaff_D7w != 0)) {
      uVar6 = puVar14[1];
      if ((uVar6 & 0xff00) != 0) {
        uVar8 = 1;
      }
      sVar9 = uVar8 - 1;
      puVar12 = puVar14 + 3;
      sVar4 = FUN_000c74cc();
      *(undefined2 *)(unaff_A5 + -0x56d2) = 0;
      if (*puVar12 == 0x3fff) {
        *(undefined2 *)(unaff_A5 + -0x56d2) = 0x2000;
        puVar12 = puVar14 + 4;
      }
      *(ushort *)(unaff_A5 + -0x56e0) = *puVar12;
      *(ushort *)(unaff_A5 + -0x56de) = puVar12[1];
      iVar13 = *(int *)(extraout_A1_00 + 0x1a);
      if ((*(byte *)(iVar13 + 0x13) & 3) != 0) {
        uVar6 = (*(byte *)(iVar13 + 0x13) & 3) << 5 ^ uVar6;
        *(short *)(unaff_A5 + -0x56de) =
             (ushort)*(byte *)(iVar13 + 0x14) + *(short *)(unaff_A5 + -0x56de);
      }
      puVar14 = (ushort *)(*(int *)(iVar13 + 4) + 10);
      if (*(short *)(unaff_A5 + -0x56d2) != 0) {
        puVar14 = (ushort *)(*(int *)(iVar13 + 4) + 0xc);
      }
      *(short *)(unaff_A5 + -0x56e0) =
           *(short *)(unaff_A5 + -0x56e0) - *(short *)(extraout_A1_00 + 0x52);
      if (*(char *)(extraout_A1_00 + 0x22) == '\0') {
        uVar8 = uVar6 & 0x1f;
        if ((uVar8 != 9) && (uVar8 != 0xf)) {
          if (uVar8 == 0x11) {
            uVar8 = 6;
          }
          else {
            uVar8 = 1;
            if (*(char *)(extraout_A1_00 + 0x381) != '\0') {
              uVar8 = 0x10;
            }
          }
        }
        uVar6 = uVar8 | uVar6 & 0xffe0;
      }
      sVar5 = *(short *)(extraout_A1_00 + 0x50);
      *(undefined2 *)(unaff_A5 + -0x56d0) = *(undefined2 *)(unaff_A5 + 0x2c2);
      if (sVar5 != 0) {
        *(short *)(unaff_A5 + -0x56d0) = sVar5;
      }
      if ((*(char *)(extraout_A1_00 + 0x13) != '\0') && (-1 < *(char *)(extraout_A1_00 + 0x13))) {
        uVar6 = *(ushort *)(extraout_A1_00 + 0x16) | uVar6 & 0xffe0;
      }
      uVar6 = (*(byte *)(extraout_A1_00 + 0x12) & 3) << 5 ^ uVar6;
      if ((uVar6 & 0x20) == 0) {
        if ((uVar6 & 0x40) == 0) {
          sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
          sVar5 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w;
          puVar12 = extraout_A0;
          if (*(char *)(extraout_A1_00 + 0x13) < '\0') {
            sVar10 = (ushort)*(byte *)(extraout_A1_00 + 0x11) << 3;
            while( true ) {
              for (; *puVar14 == 0; puVar14 = puVar14 + 1) {
                unaff_A3 = unaff_A3 + 2;
              }
              sVar1 = *(short *)(extraout_A1_00 + 0x16);
              psVar16 = unaff_A3 + 1;
              sVar3 = *unaff_A3 + ((short)((*unaff_A3 + 8) * sVar1) >> 4) + 8;
              *(short *)(unaff_A5 + -0x56c0) = sVar3;
              *puVar12 = sVar4 + (short)((uint)((int)sVar3 * (int)*(short *)(&DAT_000c82a4 + sVar10)
                                               ) >> 8);
              puVar12[1] = sVar5 + (short)((uint)((int)*(short *)(unaff_A5 + -0x56c0) *
                                                 (int)*(short *)(&DAT_000c82a6 + sVar10)) >> 8);
              unaff_A3 = unaff_A3 + 2;
              sVar3 = *psVar16 + ((short)((*psVar16 + 8) * sVar1) >> 4) + 8;
              *(short *)(unaff_A5 + -0x56be) = sVar3;
              sVar1 = *(short *)(&DAT_000c82a8 + sVar10);
              *puVar12 = *puVar12 - 8;
              puVar11 = puVar12 + 1;
              *puVar12 = (short)((uint)((int)sVar3 * (int)sVar1) >> 8) + *puVar12;
              sVar1 = *(short *)(unaff_A5 + -0x56be);
              sVar3 = *(short *)(&DAT_000c82aa + sVar10);
              *puVar11 = *puVar11 - 8;
              *puVar11 = (short)((uint)((int)sVar1 * (int)sVar3) >> 8) + *puVar11;
              if (0x1ff < *puVar12) {
                *puVar12 = 0;
              }
              if (0x1ff < puVar12[1]) {
                puVar12[1] = 0;
              }
              puVar12[2] = *puVar14;
              puVar12[3] = uVar6;
              *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) | *puVar12;
              puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) | puVar12[1];
              puVar12 = puVar12 + -4;
              unaff_D7w = unaff_D7w + -1;
              if (unaff_D7w == 0) break;
              sVar9 = sVar9 + -1;
              puVar14 = puVar14 + 1;
              if (sVar9 == -1) {
                return;
              }
            }
            return;
          }
          do {
            while( true ) {
              while( true ) {
                while( true ) {
                  for (; uVar8 = *puVar14, uVar8 == 0; puVar14 = puVar14 + 1) {
                    unaff_A3 = unaff_A3 + 2;
                  }
                  if (uVar8 != 0xf000) break;
                  *(ushort *)(unaff_A5 + -0x56da) = uVar6;
                  uVar8 = puVar14[1];
                  bVar2 = (&DAT_000c7bee)[(short)(uVar8 >> 8)];
                  *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                             *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                  puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                               *(ushort *)(unaff_A5 + -0x56d4) &
                               *(short *)(unaff_A5 + -0x56d6) + sVar5 + unaff_A3[1];
                  puVar11 = puVar14 + 3;
                  puVar12[2] = puVar14[2];
                  puVar12[3] = uVar8 | uVar6 & 0xff;
                  uVar6 = *(ushort *)(unaff_A5 + -0x56da);
                  puVar14 = puVar14 + 4;
                  unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
                  *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                  *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                  puVar12 = puVar12 + -4;
                  unaff_D7w = unaff_D7w + -1;
                  if (unaff_D7w == 0) {
                    return;
                  }
                  sVar9 = (sVar9 - (ushort)bVar2) + -1;
                  if (sVar9 == -1) {
                    return;
                  }
                }
                if (uVar8 != 0xf200) break;
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              if ((uVar8 & 0xff00) != 0xff00) break;
              unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
              puVar14 = puVar14 + 1;
            }
            psVar16 = unaff_A3 + 1;
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
            unaff_A3 = unaff_A3 + 2;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         *(short *)(unaff_A5 + -0x56d6) + sVar5 + *psVar16;
            puVar12[2] = *puVar14;
            puVar12[3] = uVar6;
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar12 + -4;
            unaff_D7w = unaff_D7w + -1;
          } while ((unaff_D7w != 0) && (sVar9 = sVar9 + -1, puVar14 = puVar14 + 1, sVar9 != -1));
        }
        else {
          sVar4 = sVar4 - *(short *)(unaff_A5 + -0x56e0);
          sVar5 = extraout_D1w - *(short *)(unaff_A5 + -0x56de);
          uVar8 = uVar6 & 0xf000;
          puVar12 = extraout_A0;
          while( true ) {
            while( true ) {
              for (; uVar7 = *puVar14, uVar7 == 0; puVar14 = puVar14 + 1) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar7 == 0xf000) break;
              if (uVar7 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              else if ((uVar7 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             (sVar5 + (-((uVar8 >> 8) + 0x10) - *psVar16)) -
                             *(short *)(unaff_A5 + -0x56d6);
                puVar12[2] = *puVar14;
                puVar12[3] = uVar6;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar12 + -4;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar9 = sVar9 + -1;
                puVar14 = puVar14 + 1;
                if (sVar9 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar6;
            uVar7 = puVar14[1];
            bVar2 = (&DAT_000c7bee)[(short)(uVar7 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       *(short *)(unaff_A5 + -0x56d8) + sVar4 + *unaff_A3 & 0x3ffU;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         (sVar5 + (-(((uVar7 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                         *(short *)(unaff_A5 + -0x56d6);
            puVar11 = puVar14 + 3;
            puVar12[2] = puVar14[2];
            puVar12[3] = uVar7 | uVar6 & 0xff;
            uVar6 = *(ushort *)(unaff_A5 + -0x56da);
            puVar14 = puVar14 + 4;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar12 + -4;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar9 = (sVar9 - (ushort)bVar2) + -1;
            if (sVar9 == -1) {
              return;
            }
          }
        }
      }
      else {
        sVar5 = ((uVar6 & 0xf00) >> 4) + 0x10;
        if ((uVar6 & 0x40) == 0) {
          sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
          sVar10 = *(short *)(unaff_A5 + -0x56de) + extraout_D1w;
          puVar12 = extraout_A0;
          while( true ) {
            while( true ) {
              for (; uVar8 = *puVar14, uVar8 == 0; puVar14 = puVar14 + 1) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar8 == 0xf000) break;
              if (uVar8 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              else if ((uVar8 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           (sVar4 + (-sVar5 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             *(short *)(unaff_A5 + -0x56d6) + sVar10 + *psVar16;
                puVar12[2] = *puVar14;
                puVar12[3] = uVar6;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar12 + -4;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar9 = sVar9 + -1;
                puVar14 = puVar14 + 1;
                if (sVar9 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar6;
            uVar8 = puVar14[1];
            bVar2 = (&DAT_000c7bee)[(short)(uVar8 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       (sVar4 + (-(((uVar8 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                       *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         *(short *)(unaff_A5 + -0x56d6) + sVar10 + unaff_A3[1];
            puVar11 = puVar14 + 3;
            puVar12[2] = puVar14[2];
            puVar12[3] = uVar8 | uVar6 & 0xff;
            uVar6 = *(ushort *)(unaff_A5 + -0x56da);
            puVar14 = puVar14 + 4;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar12 + -4;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar9 = (sVar9 - (ushort)bVar2) + -1;
            if (sVar9 == -1) {
              return;
            }
          }
        }
        else {
          sVar4 = *(short *)(unaff_A5 + -0x56e0) + sVar4;
          sVar10 = extraout_D1w - *(short *)(unaff_A5 + -0x56de);
          uVar8 = uVar6 & 0xf000;
          puVar12 = extraout_A0;
          while( true ) {
            while( true ) {
              for (; uVar7 = *puVar14, uVar7 == 0; puVar14 = puVar14 + 1) {
                unaff_A3 = unaff_A3 + 2;
              }
              if (uVar7 == 0xf000) break;
              if (uVar7 == 0xf200) {
                *(ushort *)(unaff_A5 + -0x56d8) = puVar14[1];
                *(ushort *)(unaff_A5 + -0x56d6) = puVar14[2];
                puVar14 = puVar14 + 3;
              }
              else if ((uVar7 & 0xff00) == 0xff00) {
                unaff_A3 = (short *)((int)unaff_A3 + (int)(short)((*puVar14 & 0xff) << 2));
                puVar14 = puVar14 + 1;
              }
              else {
                psVar16 = unaff_A3 + 1;
                *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                           (sVar4 + (-sVar5 - *unaff_A3)) - *(short *)(unaff_A5 + -0x56d8) & 0x3ffU;
                unaff_A3 = unaff_A3 + 2;
                puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                             *(ushort *)(unaff_A5 + -0x56d4) &
                             (sVar10 + (-((uVar8 >> 8) + 0x10) - *psVar16)) -
                             *(short *)(unaff_A5 + -0x56d6);
                puVar12[2] = *puVar14;
                puVar12[3] = uVar6;
                *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
                *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
                puVar12 = puVar12 + -4;
                unaff_D7w = unaff_D7w + -1;
                if (unaff_D7w == 0) {
                  return;
                }
                sVar9 = sVar9 + -1;
                puVar14 = puVar14 + 1;
                if (sVar9 == -1) {
                  return;
                }
              }
            }
            *(ushort *)(unaff_A5 + -0x56da) = uVar6;
            uVar7 = puVar14[1];
            bVar2 = (&DAT_000c7bee)[(short)(uVar7 >> 8)];
            *puVar12 = *(ushort *)(unaff_A5 + -0x56d0) |
                       (sVar4 + (-(((uVar7 & 0xf00) >> 4) + 0x10) - *unaff_A3)) -
                       *(short *)(unaff_A5 + -0x56d8) & 0x3ff;
            puVar12[1] = *(ushort *)(unaff_A5 + -0x56d2) |
                         *(ushort *)(unaff_A5 + -0x56d4) &
                         (sVar10 + (-(((uVar7 & 0xf000) >> 8) + 0x10) - unaff_A3[1])) -
                         *(short *)(unaff_A5 + -0x56d6);
            puVar11 = puVar14 + 3;
            puVar12[2] = puVar14[2];
            puVar12[3] = uVar7 | uVar6 & 0xff;
            uVar6 = *(ushort *)(unaff_A5 + -0x56da);
            puVar14 = puVar14 + 4;
            unaff_A3 = (short *)((int)unaff_A3 + (short)(*puVar11 << 2) + 4);
            *(undefined2 *)(unaff_A5 + -0x56d8) = 0;
            *(undefined2 *)(unaff_A5 + -0x56d6) = 0;
            puVar12 = puVar12 + -4;
            unaff_D7w = unaff_D7w + -1;
            if (unaff_D7w == 0) break;
            sVar9 = (sVar9 - (ushort)bVar2) + -1;
            if (sVar9 == -1) {
              return;
            }
          }
        }
      }
    }
  }
  return;
}



/* 000c7400 FUN_000c7400 */
/* DECOMPILATION FAILED: Exception while decompiling 000c7400: Decompiler process died
 */

/* 000c74cc FUN_000c74cc */

void FUN_000c74cc(void)

{
  return;
}



/* 000c7b00 FUN_000c7b00 */

void FUN_000c7b00(void)

{
  undefined2 unaff_D2w;
  byte unaff_D4b;
  int in_A1;
  int unaff_A5;
  
  if (*(char *)(in_A1 + 0x391) != '\x06') {
    if (*(char *)(in_A1 + 0x391) == '\b') {
      *(undefined2 *)(unaff_A5 + -0x56dc) = unaff_D2w;
      return;
    }
    if (*(char *)(in_A1 + 0x391) == '\x04') {
      *(undefined2 *)(unaff_A5 + -0x56dc) = unaff_D2w;
      return;
    }
    if (*(char *)(in_A1 + 0x391) != '\x03') {
      if ((*(char *)(in_A1 + 0x391) == '\x0e') &&
         (*(undefined2 *)(unaff_A5 + -0x56dc) = unaff_D2w, (unaff_D4b & 0xf) == 0xf)) {
        return;
      }
      if (*(char *)(in_A1 + 0x381) == '\0') {
        return;
      }
      return;
    }
  }
  *(undefined2 *)(unaff_A5 + -0x56dc) = unaff_D2w;
  if (((unaff_D4b & 0x1f) == 0xe) && (*(char *)(in_A1 + 0x381) != '\0')) {
    return;
  }
  return;
}



/* 000c845a FUN_000c845a */

void FUN_000c845a(void)

{
  return;
}



/* 000c84ac FUN_000c84ac */

void FUN_000c84ac(void)

{
  short *psVar1;
  short sVar2;
  undefined1 *extraout_A1;
  byte *pbVar3;
  undefined1 *unaff_A4;
  int unaff_A5;
  bool bVar4;
  
  psVar1 = *(short **)((int)&PTR_DAT_000c845c + (int)(short)(*(short *)(unaff_A5 + 0xc4e) << 2));
  pbVar3 = (byte *)(psVar1 + 1);
  sVar2 = *psVar1;
  if (-1 < sVar2) {
    do {
      bVar4 = *pbVar3 == 0;
      (**(code **)(&DAT_0000341e + (short)((ushort)*pbVar3 * 2)))();
      if (!bVar4) {
        *unaff_A4 = 1;
        unaff_A4[0x21] = *extraout_A1;
        unaff_A4[0x20] = extraout_A1[1];
        unaff_A4[0x11] = extraout_A1[2];
        unaff_A4[0x25] = extraout_A1[3];
        unaff_A4[0x46] = extraout_A1[4];
        *(undefined2 *)(unaff_A4 + 0xe) = *(undefined2 *)(extraout_A1 + 5);
        *(undefined2 *)(unaff_A4 + 6) = *(undefined2 *)(extraout_A1 + 7);
        *(undefined2 *)(unaff_A4 + 10) = *(undefined2 *)(extraout_A1 + 9);
      }
      pbVar3 = extraout_A1 + 0xb;
      sVar2 = sVar2 + -1;
    } while (sVar2 != -1);
  }
  return;
}



/* 000c8e1c FUN_000c8e1c */

void FUN_000c8e1c(void)

{
  short sVar1;
  int unaff_A5;
  char *pcVar2;
  
  FUN_000018ec();
  pcVar2 = &DAT_0000571e + unaff_A5;
  sVar1 = 0x13;
  do {
    if (*pcVar2 != '\0') {
      (**(code **)((int)&PTR_LAB_000c8e48 + (int)(short)((ushort)(byte)pcVar2[0x20] << 2)))();
    }
    pcVar2 = pcVar2 + 0x80;
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000caba6 FUN_000caba6 */

void FUN_000caba6(void)

{
  short sVar1;
  undefined1 *extraout_A1;
  byte *pbVar2;
  undefined1 *unaff_A4;
  int unaff_A5;
  bool bVar3;
  
  pbVar2 = (byte *)(*(short **)(&DAT_000cabfa + (short)(*(short *)(unaff_A5 + 0xc66) << 2)) + 1);
  sVar1 = **(short **)(&DAT_000cabfa + (short)(*(short *)(unaff_A5 + 0xc66) << 2));
  if (-1 < sVar1) {
    do {
      bVar3 = *pbVar2 == 0;
      (**(code **)(&DAT_0000341e + (short)((ushort)*pbVar2 * 2)))();
      if (!bVar3) {
        *unaff_A4 = 1;
        unaff_A4[0x21] = *extraout_A1;
        unaff_A4[0x20] = extraout_A1[1];
        unaff_A4[0x11] = extraout_A1[2];
        unaff_A4[0x25] = extraout_A1[3];
        unaff_A4[0x46] = extraout_A1[4];
        *(undefined2 *)(unaff_A4 + 0xe) = *(undefined2 *)(extraout_A1 + 5);
        *(undefined2 *)(unaff_A4 + 6) = *(undefined2 *)(extraout_A1 + 7);
        *(undefined2 *)(unaff_A4 + 10) = *(undefined2 *)(extraout_A1 + 9);
      }
      pbVar2 = extraout_A1 + 0xb;
      sVar1 = sVar1 + -1;
    } while (sVar1 != -1);
  }
  return;
}



/* 000ccafc FUN_000ccafc */

void FUN_000ccafc(void)

{
  short sVar1;
  int unaff_A5;
  
  sVar1 = *(short *)(&DAT_000ccb2c + (short)(*(short *)(unaff_A5 + 0xc4e) * 2));
  *(short *)(unaff_A5 + 0xe5c) = sVar1;
  sVar1 = sVar1 << 2;
  *(undefined4 *)(unaff_A5 + 0xe64) = *(undefined4 *)(&DAT_000ccc4c + sVar1);
  *(undefined4 *)(unaff_A5 + 0xe68) = *(undefined4 *)(&DAT_000ccc50 + sVar1);
  *(undefined4 *)(unaff_A5 + 0xe60) =
       *(undefined4 *)(&DAT_000d26fc + (short)(*(short *)(unaff_A5 + 0xc4e) * 4));
  return;
}



/* 000ccb6c FUN_000ccb6c */

void FUN_000ccb6c(void)

{
  short sVar1;
  int unaff_A5;
  
  sVar1 = *(short *)(&DAT_000ccb9c + (short)(*(short *)(unaff_A5 + 0xc4e) * 2));
  *(short *)(unaff_A5 + 0xedc) = sVar1;
  sVar1 = sVar1 << 2;
  *(undefined4 *)(unaff_A5 + 0xee4) = *(undefined4 *)(&DAT_000ccc4c + sVar1);
  *(undefined4 *)(unaff_A5 + 0xee8) = *(undefined4 *)(&DAT_000ccc50 + sVar1);
  *(undefined4 *)(unaff_A5 + 0xee0) =
       *(undefined4 *)(&DAT_000d277c + (short)(*(short *)(unaff_A5 + 0xc4e) * 4));
  return;
}



/* 000ccbdc FUN_000ccbdc */

void FUN_000ccbdc(void)

{
  short sVar1;
  int unaff_A5;
  
  sVar1 = *(short *)(&DAT_000ccc0c + (short)(*(short *)(unaff_A5 + 0xc4e) * 2));
  *(short *)(unaff_A5 + 0xf5c) = sVar1;
  sVar1 = sVar1 << 2;
  *(undefined4 *)(unaff_A5 + 0xf64) = *(undefined4 *)(&DAT_000ccc4c + sVar1);
  *(undefined4 *)(unaff_A5 + 0xf68) = *(undefined4 *)(&DAT_000ccc50 + sVar1);
  *(undefined4 *)(unaff_A5 + 0xf60) =
       *(undefined4 *)(&DAT_000d27fc + (short)(*(short *)(unaff_A5 + 0xc4e) * 4));
  return;
}



/* 000ccc5c FUN_000ccc5c */

void FUN_000ccc5c(void)

{
  short sVar1;
  int unaff_A5;
  
  *(short *)(unaff_A5 + 0xcb0) = *(short *)(unaff_A5 + 0xc4e);
  sVar1 = *(short *)(unaff_A5 + 0xc4e) << 3;
  *(ushort *)(unaff_A5 + 0x4e) =
       *(ushort *)(&DAT_000ccf58 + sVar1) | *(ushort *)(unaff_A5 + 0x4e) & 0xf;
  *(undefined2 *)(unaff_A5 + 0x54) = *(undefined2 *)(&DAT_000ccf5a + sVar1);
  *(undefined2 *)(unaff_A5 + 0x2c2) = *(undefined2 *)(&DAT_000ccf5c + sVar1);
  return;
}



/* 000ccc88 FUN_000ccc88 */

void FUN_000ccc88(void)

{
  short sVar1;
  int unaff_A5;
  
  sVar1 = *(short *)(unaff_A5 + 0xc4e) * 0xc;
  *(undefined2 *)(unaff_A5 + 0xe54) = *(undefined2 *)(&DAT_000cce68 + sVar1);
  *(undefined2 *)(unaff_A5 + 0xe58) = *(undefined2 *)(&DAT_000cce6a + sVar1);
  *(undefined2 *)(unaff_A5 + 0xed4) = *(undefined2 *)(&DAT_000cce6c + sVar1);
  *(undefined2 *)(unaff_A5 + 0xed8) = *(undefined2 *)(&DAT_000cce6e + sVar1);
  *(undefined2 *)(unaff_A5 + 0xf54) = *(undefined2 *)(&DAT_000cce70 + sVar1);
  *(undefined2 *)(unaff_A5 + 0xf58) = *(undefined2 *)(&DAT_000cce72 + sVar1);
  return;
}



/* 000cccf2 FUN_000cccf2 */

void FUN_000cccf2(void)

{
  short sVar1;
  int unaff_A5;
  
  sVar1 = *(short *)(unaff_A5 + 0xc4e) * 6;
  *(undefined *)(unaff_A5 + 0xe78) = (&DAT_000ccd28)[sVar1];
  *(undefined *)(unaff_A5 + 0xe79) = (&DAT_000ccd29)[sVar1];
  *(undefined *)(unaff_A5 + 0xef8) = (&DAT_000ccd2a)[sVar1];
  *(undefined *)(unaff_A5 + 0xef9) = (&DAT_000ccd2b)[sVar1];
  *(undefined *)(unaff_A5 + 0xf78) = (&DAT_000ccd2c)[sVar1];
  *(undefined *)(unaff_A5 + 0xf79) = (&DAT_000ccd2d)[sVar1];
  return;
}



/* 000ccff8 FUN_000ccff8 */

void FUN_000ccff8(void)

{
  int unaff_A5;
  
  DAT_00804152 = *(short *)(&DAT_000cd024 + (short)(*(short *)(unaff_A5 + 0xcb0) * 2));
  if ((DAT_00804152 != 0x106) && (*(char *)(unaff_A5 + 0x2de) != '\0')) {
    DAT_00804152 = 0x80 - (DAT_00804152 + -0x80);
  }
  return;
}



/* 000cd182 FUN_000cd182 */

void FUN_000cd182(void)

{
  short sVar1;
  int unaff_A5;
  int unaff_A6;
  
  *(undefined2 *)(unaff_A5 + 0x32) = *(undefined2 *)(unaff_A6 + 6);
  *(undefined2 *)(unaff_A5 + 0x34) = *(undefined2 *)(unaff_A6 + 10);
  sVar1 = 0xf;
  do {
    FUN_000cd496();
    FUN_000cd550();
    FUN_000cd634();
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000cd282 FUN_000cd282 */

void FUN_000cd282(void)

{
  short sVar1;
  int unaff_A5;
  int unaff_A6;
  
  sVar1 = 0x29;
  *(undefined2 *)(unaff_A5 + 0x36) = *(undefined2 *)(unaff_A6 + 6);
  *(undefined2 *)(unaff_A5 + 0x38) = *(undefined2 *)(unaff_A6 + 10);
  do {
    FUN_000cd4bc();
    FUN_000cd57e();
    FUN_000cd744();
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000cd318 FUN_000cd318 */

void FUN_000cd318(void)

{
  short sVar1;
  int unaff_A5;
  int unaff_A6;
  
  sVar1 = 0x15;
  *(undefined2 *)(unaff_A5 + 0x3a) = *(undefined2 *)(unaff_A6 + 6);
  *(undefined2 *)(unaff_A5 + 0x3c) = *(undefined2 *)(unaff_A6 + 10);
  do {
    FUN_000cd4e2();
    FUN_000cd5ae();
    FUN_000cd7de();
    sVar1 = sVar1 + -1;
  } while (sVar1 != -1);
  return;
}



/* 000cd46a FUN_000cd46a */

undefined2 FUN_000cd46a(void)

{
  ushort in_D0w;
  
  return *(undefined2 *)(&DAT_000cd488 + (short)(in_D0w & 0xf));
}



/* 000cd496 FUN_000cd496 */

short FUN_000cd496(void)

{
  ushort unaff_D5w;
  ushort unaff_D6w;
  
  return (unaff_D6w & 0x100) * 0x20 + ((unaff_D6w & 0xe0) >> 1) + (unaff_D5w & 0x1e0) * 0x10;
}



/* 000cd4bc FUN_000cd4bc */

short FUN_000cd4bc(void)

{
  ushort unaff_D5w;
  ushort unaff_D6w;
  
  return (unaff_D6w & 0x300) * 0x10 + ((unaff_D6w & 0xf0) >> 2) + (unaff_D5w & 0x3f0) * 4;
}



/* 000cd4e2 FUN_000cd4e2 */

short FUN_000cd4e2(void)

{
  ushort unaff_D5w;
  ushort unaff_D6w;
  
  return (unaff_D5w & 0x7e0) + ((unaff_D6w & 0xe0) >> 3) + (unaff_D6w & 0x700) * 8;
}



/* 000cd550 FUN_000cd550 */

undefined4 FUN_000cd550(void)

{
  int iVar1;
  uint uVar2;
  ushort uVar3;
  ushort uVar4;
  byte unaff_D5b;
  byte unaff_D6b;
  int unaff_A6;
  
  iVar1 = FUN_000cd5da();
  uVar2 = CONCAT22((short)((uint)(iVar1 << 7) >> 0x10),(ushort)unaff_D6b) & 0xffff00e0;
  uVar3 = (ushort)uVar2 >> 4;
  *(ushort *)(unaff_A6 + 0x28) = uVar3;
  uVar4 = (unaff_D5b & 0xe0) >> 1;
  *(ushort *)(unaff_A6 + 0x26) = uVar4;
  return CONCAT22((short)(uVar2 >> 0x10),uVar4 + uVar3);
}



/* 000cd57e FUN_000cd57e */

undefined4 FUN_000cd57e(void)

{
  int iVar1;
  uint uVar2;
  ushort uVar3;
  short sVar4;
  byte unaff_D5b;
  byte unaff_D6b;
  int unaff_A6;
  
  iVar1 = FUN_000cd5da();
  uVar2 = CONCAT22((short)((uint)(iVar1 << 10) >> 0x10),(ushort)unaff_D6b) & 0xffff00f0;
  uVar3 = (ushort)uVar2 >> 2;
  *(ushort *)(unaff_A6 + 0x28) = uVar3;
  sVar4 = (unaff_D5b & 0xf0) * 4;
  *(short *)(unaff_A6 + 0x26) = sVar4;
  return CONCAT22((short)(uVar2 >> 0x10),sVar4 + uVar3);
}



/* 000cd5ae FUN_000cd5ae */

undefined4 FUN_000cd5ae(void)

{
  undefined2 extraout_var;
  uint uVar1;
  ushort uVar2;
  byte unaff_D5b;
  byte unaff_D6b;
  int unaff_A6;
  
  FUN_000cd5da();
  uVar1 = CONCAT22(extraout_var,(ushort)unaff_D6b) & 0xffff00e0;
  uVar2 = (ushort)uVar1 >> 3;
  *(ushort *)(unaff_A6 + 0x28) = uVar2;
  *(ushort *)(unaff_A6 + 0x26) = unaff_D5b & 0xe0;
  return CONCAT22((short)(uVar1 >> 0x10),(unaff_D5b & 0xe0) + uVar2);
}



/* 000cd5da FUN_000cd5da */

void FUN_000cd5da(void)

{
  int unaff_A6;
  
                    /* WARNING: Could not recover jumptable at 0x000cd5e4. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)((int)&PTR_DAT_000cd5e8 +
            (int)*(short *)((int)&PTR_DAT_000cd5e8 + (int)*(short *)(unaff_A6 + 0xe))))();
  return;
}



/* 000cd634 FUN_000cd634 */

void FUN_000cd634(void)

{
  short sVar1;
  ushort uVar2;
  int iVar3;
  ushort unaff_D6w;
  undefined4 *extraout_A0;
  undefined4 *extraout_A0_00;
  undefined4 *puVar4;
  ushort *extraout_A1;
  ushort *extraout_A1_00;
  ushort *puVar5;
  
  FUN_000cd664();
  FUN_000cd6c0();
  sVar1 = -((~unaff_D6w & 0xe0) >> 5);
  uVar2 = sVar1 + 0xe;
  puVar4 = extraout_A0;
  puVar5 = extraout_A1;
  if (7 < uVar2) {
    FUN_000cd664();
    FUN_000cd6c0();
    uVar2 = sVar1 + 6;
    puVar4 = extraout_A0_00;
    puVar5 = extraout_A1_00;
  }
  do {
    iVar3 = (uint)*puVar5 * 0x40;
    *puVar4 = *(undefined4 *)(iVar3 + 0x300000);
    puVar4[1] = *(undefined4 *)(&DAT_00300004 + iVar3);
    puVar4[2] = *(undefined4 *)(&DAT_00300008 + iVar3);
    puVar4[3] = *(undefined4 *)(&DAT_0030000c + iVar3);
    puVar4[0x20] = *(undefined4 *)(&DAT_00300010 + iVar3);
    puVar4[0x21] = *(undefined4 *)(&DAT_00300014 + iVar3);
    puVar4[0x22] = *(undefined4 *)(&DAT_00300018 + iVar3);
    puVar4[0x23] = *(undefined4 *)(&DAT_0030001c + iVar3);
    puVar4[0x40] = *(undefined4 *)(&DAT_00300020 + iVar3);
    puVar4[0x41] = *(undefined4 *)(&DAT_00300024 + iVar3);
    puVar4[0x42] = *(undefined4 *)(&DAT_00300028 + iVar3);
    puVar4[0x43] = *(undefined4 *)(&DAT_0030002c + iVar3);
    puVar4[0x60] = *(undefined4 *)(&DAT_00300030 + iVar3);
    puVar4[0x61] = *(undefined4 *)(&DAT_00300034 + iVar3);
    puVar4[0x62] = *(undefined4 *)(&DAT_00300038 + iVar3);
    puVar4[99] = *(undefined4 *)(&DAT_0030003c + iVar3);
    puVar4 = puVar4 + 4;
    uVar2 = uVar2 - 1;
    puVar5 = puVar5 + 1;
  } while (uVar2 != 0xffff);
  return;
}



/* 000cd664 FUN_000cd664 */

void FUN_000cd664(void)

{
  short in_D0w;
  int iVar1;
  undefined4 *in_A0;
  ushort *in_A1;
  
  do {
    iVar1 = (uint)*in_A1 * 0x40;
    *in_A0 = *(undefined4 *)(iVar1 + 0x300000);
    in_A0[1] = *(undefined4 *)(&DAT_00300004 + iVar1);
    in_A0[2] = *(undefined4 *)(&DAT_00300008 + iVar1);
    in_A0[3] = *(undefined4 *)(&DAT_0030000c + iVar1);
    in_A0[0x20] = *(undefined4 *)(&DAT_00300010 + iVar1);
    in_A0[0x21] = *(undefined4 *)(&DAT_00300014 + iVar1);
    in_A0[0x22] = *(undefined4 *)(&DAT_00300018 + iVar1);
    in_A0[0x23] = *(undefined4 *)(&DAT_0030001c + iVar1);
    in_A0[0x40] = *(undefined4 *)(&DAT_00300020 + iVar1);
    in_A0[0x41] = *(undefined4 *)(&DAT_00300024 + iVar1);
    in_A0[0x42] = *(undefined4 *)(&DAT_00300028 + iVar1);
    in_A0[0x43] = *(undefined4 *)(&DAT_0030002c + iVar1);
    in_A0[0x60] = *(undefined4 *)(&DAT_00300030 + iVar1);
    in_A0[0x61] = *(undefined4 *)(&DAT_00300034 + iVar1);
    in_A0[0x62] = *(undefined4 *)(&DAT_00300038 + iVar1);
    in_A0[99] = *(undefined4 *)(&DAT_0030003c + iVar1);
    in_A0 = in_A0 + 4;
    in_D0w = in_D0w + -1;
    in_A1 = in_A1 + 1;
  } while (in_D0w != -1);
  return;
}



/* 000cd6c0 FUN_000cd6c0 */

ulonglong FUN_000cd6c0(void)

{
  ushort uVar1;
  int in_A0;
  int unaff_A6;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x18) & *(short *)(unaff_A6 + 0x16) + *(short *)(unaff_A6 + 0x20);
  *(ushort *)(unaff_A6 + 0x20) = uVar1;
  return CONCAT44(CONCAT22((short)(((uint)*(ushort *)(*(int *)(unaff_A6 + 0x12) + (int)(short)uVar1)
                                   << 7) >> 0x10),*(undefined2 *)(unaff_A6 + 0x26)),in_A0 + 0x1ff0)
         & 0xffffffff00003000;
}



/* 000cd744 FUN_000cd744 */

void FUN_000cd744(void)

{
  ushort uVar1;
  ushort unaff_D6w;
  short *extraout_A0;
  short *extraout_A0_00;
  short *psVar2;
  undefined4 *extraout_A1;
  undefined4 *extraout_A1_00;
  undefined4 *puVar3;
  
  FUN_000cd77c();
  FUN_000cd78a();
  FUN_000cd77c();
  FUN_000cd78a();
  uVar1 = 0x20 - (((~unaff_D6w & 0xf0) >> 4) + 0x10);
  psVar2 = extraout_A0;
  puVar3 = extraout_A1;
  if (0xf < uVar1) {
    FUN_000cd77c();
    FUN_000cd78a();
    uVar1 = 0;
    psVar2 = extraout_A0_00;
    puVar3 = extraout_A1_00;
  }
  do {
    *(undefined4 *)psVar2 = *puVar3;
    *psVar2 = *psVar2 + 0x2000;
    uVar1 = uVar1 - 1;
    psVar2 = psVar2 + 2;
    puVar3 = puVar3 + 1;
  } while (uVar1 != 0xffff);
  return;
}



/* 000cd77c FUN_000cd77c */

void FUN_000cd77c(void)

{
  short in_D0w;
  short *in_A0;
  undefined4 *in_A1;
  
  do {
    *(undefined4 *)in_A0 = *in_A1;
    *in_A0 = *in_A0 + 0x2000;
    in_D0w = in_D0w + -1;
    in_A0 = in_A0 + 2;
    in_A1 = in_A1 + 1;
  } while (in_D0w != -1);
  return;
}



/* 000cd78a FUN_000cd78a */

ulonglong FUN_000cd78a(void)

{
  ushort uVar1;
  int in_A0;
  int unaff_A6;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x18) & *(short *)(unaff_A6 + 0x16) + *(short *)(unaff_A6 + 0x20);
  *(ushort *)(unaff_A6 + 0x20) = uVar1;
  return CONCAT44(CONCAT22((short)(((uint)*(ushort *)(*(int *)(unaff_A6 + 0x12) + (int)(short)uVar1)
                                   << 10) >> 0x10),*(undefined2 *)(unaff_A6 + 0x26)),in_A0 + 0xffc)
         & 0xffffffff00003000;
}



/* 000cd7de FUN_000cd7de */

void FUN_000cd7de(void)

{
  ushort uVar1;
  ushort unaff_D6w;
  short *extraout_A0;
  short *extraout_A0_00;
  short *psVar2;
  undefined4 *extraout_A1;
  undefined4 *extraout_A1_00;
  undefined4 *puVar3;
  
  FUN_000cd816();
  FUN_000cd824();
  FUN_000cd816();
  FUN_000cd824();
  uVar1 = 0x10 - (((~unaff_D6w & 0xe0) >> 5) + 8);
  psVar2 = extraout_A0;
  puVar3 = extraout_A1;
  if (7 < uVar1) {
    FUN_000cd816();
    FUN_000cd824();
    uVar1 = 0;
    psVar2 = extraout_A0_00;
    puVar3 = extraout_A1_00;
  }
  do {
    *(undefined4 *)psVar2 = *puVar3;
    *psVar2 = *psVar2 + 0x5600;
    uVar1 = uVar1 - 1;
    psVar2 = psVar2 + 2;
    puVar3 = puVar3 + 1;
  } while (uVar1 != 0xffff);
  return;
}



/* 000cd816 FUN_000cd816 */

void FUN_000cd816(void)

{
  short in_D0w;
  short *in_A0;
  undefined4 *in_A1;
  
  do {
    *(undefined4 *)in_A0 = *in_A1;
    *in_A0 = *in_A0 + 0x5600;
    in_D0w = in_D0w + -1;
    in_A0 = in_A0 + 2;
    in_A1 = in_A1 + 1;
  } while (in_D0w != -1);
  return;
}



/* 000cd824 FUN_000cd824 */

ulonglong FUN_000cd824(void)

{
  ushort uVar1;
  int in_A0;
  int unaff_A6;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x18) & *(short *)(unaff_A6 + 0x16) + *(short *)(unaff_A6 + 0x20);
  *(ushort *)(unaff_A6 + 0x20) = uVar1;
  return CONCAT44(CONCAT22(*(ushort *)(*(int *)(unaff_A6 + 0x12) + (int)(short)uVar1) >> 8,
                           *(undefined2 *)(unaff_A6 + 0x26)),in_A0 + 0x7fc) & 0xffffff00003800;
}



/* 000cda06 FUN_000cda06 */

void FUN_000cda06(void)

{
  short sVar1;
  ushort uVar2;
  ushort unaff_D5w;
  short *extraout_A0;
  short *extraout_A0_00;
  short *psVar3;
  undefined4 *extraout_A1;
  undefined4 *extraout_A1_00;
  undefined4 *puVar4;
  
  FUN_000cda44();
  FUN_000cda58();
  FUN_000cda44();
  FUN_000cda58();
  sVar1 = -(((~unaff_D5w & 0xe0) >> 5) + 9);
  uVar2 = sVar1 + 0x15;
  psVar3 = extraout_A0;
  puVar4 = extraout_A1;
  if (7 < uVar2) {
    FUN_000cda44();
    FUN_000cda58();
    uVar2 = sVar1 + 0xd;
    psVar3 = extraout_A0_00;
    puVar4 = extraout_A1_00;
  }
  do {
    *(undefined4 *)psVar3 = *puVar4;
    *psVar3 = *psVar3 + 0x5600;
    psVar3 = psVar3 + 0x10;
    puVar4 = puVar4 + 8;
    uVar2 = uVar2 - 1;
  } while (uVar2 != 0xffff);
  return;
}



/* 000cda44 FUN_000cda44 */

void FUN_000cda44(void)

{
  short in_D0w;
  short *in_A0;
  undefined4 *in_A1;
  
  do {
    *(undefined4 *)in_A0 = *in_A1;
    *in_A0 = *in_A0 + 0x5600;
    in_A0 = in_A0 + 0x10;
    in_A1 = in_A1 + 8;
    in_D0w = in_D0w + -1;
  } while (in_D0w != -1);
  return;
}



/* 000cda58 FUN_000cda58 */

undefined4 FUN_000cda58(void)

{
  ushort uVar1;
  int unaff_A6;
  
  uVar1 = *(ushort *)(unaff_A6 + 0x1c) & *(ushort *)(unaff_A6 + 0x22) |
          *(ushort *)(unaff_A6 + 0x1a) & *(ushort *)(unaff_A6 + 0x22) + 2;
  *(ushort *)(unaff_A6 + 0x22) = uVar1;
  return CONCAT22(*(ushort *)(*(int *)(unaff_A6 + 0x12) + (int)(short)uVar1) >> 8,
                  *(undefined2 *)(unaff_A6 + 0x28));
}


