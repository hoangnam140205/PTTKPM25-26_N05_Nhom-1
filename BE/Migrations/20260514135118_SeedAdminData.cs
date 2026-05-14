using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL01");

            migrationBuilder.UpdateData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL02",
                column: "TenNL",
                value: "Thịt Bò Úc");

            migrationBuilder.UpdateData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL03",
                columns: new[] { "DonViTinh", "TenNL" },
                values: new object[] { "Kg", "Cà chua Đà Lạt" });

            migrationBuilder.InsertData(
                table: "NguyenLieus",
                columns: new[] { "MaNL", "DonGia", "DonViTinh", "GiaTriTon", "SoLuongTon", "TenNL" },
                values: new object[] { "NL04", 0f, "Thùng", 0f, 0f, "Bia Heineken" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL04");

            migrationBuilder.UpdateData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL02",
                column: "TenNL",
                value: "Cà chua Đà Lạt");

            migrationBuilder.UpdateData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL03",
                columns: new[] { "DonViTinh", "TenNL" },
                values: new object[] { "Thùng", "Bia Heineken" });

            migrationBuilder.InsertData(
                table: "NguyenLieus",
                columns: new[] { "MaNL", "DonGia", "DonViTinh", "GiaTriTon", "SoLuongTon", "TenNL" },
                values: new object[] { "NL01", 0f, "Kg", 0f, 0f, "Thịt Bò Úc" });
        }
    }
}
