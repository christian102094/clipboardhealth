const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

function generateDataAndKey(data) {
  return {
    data,
    expectedKey: crypto
      .createHash("sha3-512")
      .update(JSON.stringify(data))
      .digest("hex"),
  };
}

describe("deterministicPartitionKey", () => {
  describe("Should return a trivial key", () => {
    it("Given no input", () => {
      const trivialKey = deterministicPartitionKey();
      expect(trivialKey).toBe("0");
    });

    it("Given a falsy input", () => {
      const trivialKey = deterministicPartitionKey(false);
      expect(trivialKey).toBe("0");
    });

    it("Given a falsy input", () => {
      const trivialKey = deterministicPartitionKey("");
      expect(trivialKey).toBe("0");
    });
  });

  describe("Should return a key", () => {
    [
      { data: true, expectedKey: "true" },
      { data: 1, expectedKey: "1" },
      { data: { abc: "def" }, expectedKey: `{"abc":"def"}` },
      { data: "Clipboard Health", expectedKey: "Clipboard Health" },
    ].forEach(({ data, expectedKey }) => {
      it(`Given the partition key is valid`, () => {
        const key = deterministicPartitionKey({ partitionKey: data });
        expect(key).toBe(expectedKey);
      });
    });
  });

  describe("Should return a hash", () => {
    [
      generateDataAndKey({}),
      generateDataAndKey({ data1: "abc" }),
      generateDataAndKey({ partitionKey: "" }),
      generateDataAndKey({ partitionKey: 0 }),
    ].forEach(({ data, expectedKey }) => {
      it("Given the partition key is not valid", () => {
        const key = deterministicPartitionKey(data);
        expect(key).toBe(expectedKey);
      });
    });

    it("Given the partition key exceeds the maximum length of 256", () => {
      const key = deterministicPartitionKey({
        partitionKey: "a".repeat(257),
      });
      expect(key).toBe(
        "5008048b64c14975181175f157be4a780c3d443d2177edf323d57884bc7e3979b9b53bca1325e880df3da0d97c435693441cb5527fbe950f5585678dfbb37785"
      );
    });
  });
});
