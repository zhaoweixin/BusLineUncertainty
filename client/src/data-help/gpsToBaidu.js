var pi = 3.14159265358979324;
var a = 6378245.0;
var ee = 0.00669342162296594323;
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
export default class GTB 
{


        static transformlat(x, y)
        {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
            return ret;

        }



        static transformLon(x, y) {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));

            ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
            return ret;

        }


        static bd_encrypt(gg) {
            // var bd = new Object();
            var x = gg[0];
            var y = gg[1];

            var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
            var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);

            var x2 = parseFloat((z * Math.cos(theta) + 0.0065).toFixed(6));
            var y2 = parseFloat((z * Math.sin(theta) + 0.006).toFixed(6));

            var bd = [];
            bd.push(x2);
            bd.push(y2);

            return bd;
        }


        static transform(point) {
            // var gg = new Object();

            var dLat = GTB.transformlat(point[0] - 105.0, point[1] - 35.0);
            var dLon = GTB.transformLon(point[0] - 105.0, point[1] - 35.0);


            var radLat = point[1] / 180.0 * pi;
            var magic = Math.sin(radLat);
            magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
            var y1 = point[1] + dLat;
            var x1 = point[0] + dLon;
            // var gg = new BMap.Point(x1, y1);
            var gg=[]
            gg.push(x1);
            gg.push(y1);
            return gg;

        }
}