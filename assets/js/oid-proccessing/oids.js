module.exports.black_and_white_loop_info = [
    {inc_name: 'black',   cartridge_number: 1, inc_number: 2, max_capacity_bw: 3, max_capacity_color: 9}];
module.exports.colors_info = [{
    inc_name:  'cyan',    cartridge_number: 3, inc_number: 4, max_capacity_bw: 3, max_capacity_color: 10},
    {inc_name: 'magenta', cartridge_number: 5, inc_number: 6, max_capacity_bw: 3, max_capacity_color: 11},
    {inc_name: 'yellow',  cartridge_number: 7, inc_number: 8, max_capacity_bw: 3, max_capacity_color: 12}];

module.exports.colors_loop_info = () => {
    return exports.black_and_white_loop_info.concat(exports.colors_info);
};
module.exports.oidsArray  =
{
    pr_name: ["1.3.6.1.2.1.1.5.0"],

    lifetime_prints:['1.3.6.1.2.1.43.10.2.1.4.1.1'],
    bw: ["1.3.6.1.2.1.43.11.1.1.6.1.1",        //black name
        "1.3.6.1.2.1.43.11.1.1.9.1.1"],       //black cartridge
    colors: {
        cyan_name: "1.3.6.1.2.1.43.11.1.1.6.1.2",     //cyan name
        cyan: "1.3.6.1.2.1.43.11.1.1.9.1.2",     //cyan cartridge
        magenta_name: "1.3.6.1.2.1.43.11.1.1.6.1.3",     //magenta name
        magenta: "1.3.6.1.2.1.43.11.1.1.9.1.3",     //magenta cartridge
        yellow_name: "1.3.6.1.2.1.43.11.1.1.6.1.4",     //yellow name
        yellow: "1.3.6.1.2.1.43.11.1.1.9.1.4"
    },     //yellow cartridge
    max_capacity_bw: ["1.3.6.1.2.1.43.11.1.1.8.1.1"],
    max_capacity_color: ["1.3.6.1.2.1.43.11.1.1.8.1.2",
        "1.3.6.1.2.1.43.11.1.1.8.1.3",
        "1.3.6.1.2.1.43.11.1.1.8.1.4"
    ]
};

module.exports.oid_color_array = ()=>{
    let colorArray = [];
    Object.keys(exports.oidsArray.colors).map(function (key) {
        colorArray.push(exports.oidsArray.colors[key]);
    });
    return colorArray;
};
