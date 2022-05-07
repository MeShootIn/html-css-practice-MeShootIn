const enumParams = (Enum: any) => Object.entries<string>(Enum)
  .map(([_, value]) => value);

export default enumParams;