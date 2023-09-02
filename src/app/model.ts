export interface Instruction {
    label: string; 
    versions: InstructionVersion[];
}

export interface InstructionVersion {
    label: string; 
    operatingPoint: string; 
    type: string; 
}