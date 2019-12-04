const request = require("supertest");
const app = require("../app");

// require("fs").writeFileSync(
//     "./post.json",
//     JSON.stringify({
//         oldSpec: require("../../oas-files/Meraki openapiSpec 20-apr-19.json"),
//         newSpec: require("../../oas-files/Meraki openapiSpec 26-apr-19.json"),
//         location: "./output"
//     }),
//     "utf-8"
// );

describe("POST /swagger/diff", () => {
    const agent = request.agent(app);

    it("Normal request with url", () => {
        return agent
            .post("/swagger/diff")
            .set("Content-Type", "application/json")
            .send({
                oldSpec: require("../../oas-files/Meraki openapiSpec 20-apr-19.json"),
                newSpec: require("../../oas-files/Meraki openapiSpec 26-apr-19.json"),
                location: "./output"
            })
            .expect(200)
            .then(response => {
                console.log(response.body);
            });
    });
});
