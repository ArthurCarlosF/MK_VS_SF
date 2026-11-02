#pragma once
using uint8_t=unsigned char;using int8_t=signed char;using uint16_t=unsigned short;using int16_t=short;using uint32_t=unsigned int;using int32_t=int;using u16=uint16_t;using u32=uint32_t;using offs_t=uint32_t;using size_t=unsigned long long;
extern "C" __declspec(dllimport) void* __stdcall CreateFileA(const char*,unsigned,unsigned,void*,unsigned,unsigned,void*);
extern "C" __declspec(dllimport) int __stdcall ReadFile(void*,void*,unsigned,unsigned*,void*);
extern "C" __declspec(dllimport) int __stdcall WriteFile(void*,const void*,unsigned,unsigned*,void*);
extern "C" __declspec(dllimport) void* __stdcall GetStdHandle(unsigned);
extern "C" __declspec(dllimport) char* __stdcall GetCommandLineA();
extern "C" __declspec(dllimport) void __stdcall ExitProcess(unsigned);
inline void operator delete(void*)noexcept{} inline void operator delete(void*,size_t)noexcept{}
namespace std {class ostream {public:char buf[4096];unsigned used;ostream():used(0){buf[0]=0;}ostream& operator<<(const char*s){while(*s&&used<4094)buf[used++]=*s++;buf[used]=0;return *this;}ostream& operator<<(char c){if(used<4094)buf[used++]=c;buf[used]=0;return *this;}};}
namespace util {
inline void stream_format(std::ostream&s,const char*f){s<<f;}
template<typename T,typename... A> void stream_format(std::ostream& s,const char* f,T v,A... a){while(*f&&*f!='%')s<<*f++;if(!*f)return;f++;int width=0;char pad=' ';if(*f=='0')pad='0';while(*f>='0'&&*f<='9')width=width*10+*f++-'0';char spec=*f++;if(spec=='c')s<<(char)v;else{char n[40];int k=0;unsigned value=(unsigned)v;unsigned radix=spec=='X'||spec=='x'?16:10;if(spec=='d'&&(int)value<0){s<<'-';value=-(int)value;}do{unsigned digit=value%radix;n[k++]=(char)(digit<10?'0'+digit:'A'+digit-10);value/=radix;}while(value);while(width>k){s<<pad;width--;}while(k)s<<n[--k];}stream_format(s,f,a...);}
class disasm_interface {
public:
static constexpr uint32_t SUPPORTED=0x80000000,STEP_OUT=0x40000000,STEP_OVER=0x20000000,STEP_COND=0x10000000;
class data_buffer {public:static uint8_t bytes[1048576];uint16_t r16(offs_t a)const {unsigned o=(a-0xff800000u)/8;return o+1<1048576?bytes[o]|(bytes[o+1]<<8):0;}uint32_t r32(offs_t a)const{return r16(a)|(uint32_t(r16(a+16))<<16);}};
virtual ~disasm_interface()=default;virtual u32 opcode_alignment()const=0;virtual offs_t disassemble(std::ostream&,offs_t,const data_buffer&,const data_buffer&)=0;
};}
