/* FOCUSED AUTOMATIC RECONSTRUCTION. NOT ORIGINAL OR BUILDABLE SOURCE. */
/* Function names are analyst hypotheses. Confirmed runtime observations are in the report. */

/* ADDRESS 7f862 */
/* FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* ADDRESS 7f87a */
/* FAILED: 
Low-level Error: Assignment to constant at r0x0007f738 */

/* ADDRESS 7f8b8 */
/* FAILED: 
Low-level Error: Assignment to constant at r0x000851f4 */

/* ADDRESS 7fa4a */
/* FAILED: 
Low-level Error: Assignment to constant at r0x00079c94 */

/* ADDRESS 7fba8 */
/* FAILED: 
Low-level Error: Assignment to constant at r0x0007f09c */

/* ADDRESS 7fd6e */
/* FAILED: 
Low-level Error: Assignment to constant at r0x0007cd98 */

/* ADDRESS 7fed2 */
/* FAILED: 
Low-level Error: Assignment to constant at r0x0007f09c */

/* ADDRESS 802ec */

void ryu_action_state_candidate(void)

{
  undefined2 in_D0w;
  int unaff_A6;
  
  if (*(char *)(unaff_A6 + 0x47) != '\0') {
    *(char *)(unaff_A6 + 0x47) = *(char *)(unaff_A6 + 0x47) + -1;
    return;
  }
                    /* WARNING: Could not recover jumptable at 0x00080300. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)(*(short *)(CONCAT11((char)((ushort)in_D0w >> 8),*(undefined1 *)(unaff_A6 + 0x188)) +
                       0x80304) + 0x80304))();
  return;
}



/* ADDRESS 5246 */

/* WARNING: Control flow encountered bad instruction data */
/* WARNING: Switch with 1 destination removed at 0x0000528a */
/* WARNING: Exceeded maximum restarts with more pending */

void animation_character_dispatch_candidate(void)

{
                    /* WARNING (jumptable): Sanity check requires truncation of jumptable */
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}



/* ADDRESS 10ff12 */

void ryu_animation_select_candidate(void)

{
  undefined2 *puVar1;
  int iVar2;
  byte bVar3;
  short in_D1w;
  int unaff_A6;
  
  bVar3 = *(byte *)(unaff_A6 + 0x12) ^ *(byte *)(unaff_A6 + 0x11);
  iVar2 = *(short *)(in_D1w + 0x10ff46) + 0x10ff46;
  puVar1 = (undefined2 *)(iVar2 + *(short *)(iVar2 + CONCAT11((char)bVar3 >> 7,bVar3 * '\x02')));
  *(undefined2 **)(unaff_A6 + 0x1a) = puVar1;
  *(undefined2 *)(unaff_A6 + 0x18) = *puVar1;
  *(undefined2 *)(unaff_A6 + 0x14) = puVar1[1];
  return;
}


