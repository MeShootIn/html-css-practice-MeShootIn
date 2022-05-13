const enumParams = (Enum) => Object.entries(Enum)
    .map(([_, value]) => value);
export default enumParams;
