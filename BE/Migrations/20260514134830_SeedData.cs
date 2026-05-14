using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BE.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Bans",
                columns: new[] { "MaBan", "TenBan", "TrangThai" },
                values: new object[,]
                {
                    { 1, "Bàn số 1", "Trong" },
                    { 2, "Bàn số 2", "Trong" },
                    { 3, "Bàn số 3", "Trong" },
                    { 4, "Bàn VIP 1", "Trong" }
                });

            migrationBuilder.InsertData(
                table: "KhuyenMais",
                columns: new[] { "MaKM", "HanSuDung", "PhanTramGiam" },
                values: new object[,]
                {
                    { "CHAO_PHONG", new DateTime(2026, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10f },
                    { "KHAITRUONG", new DateTime(2026, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 20f }
                });

            migrationBuilder.InsertData(
                table: "MonAns",
                columns: new[] { "MaMon", "GiaTien", "HinhAnh", "TenMon", "TrangThai" },
                values: new object[,]
                {
                    { "M01", 150000f, null, "Bít tết sốt tiêu đen", "DangBan" },
                    { "M02", 65000f, null, "Salad cá ngừ", "DangBan" },
                    { "M03", 30000f, null, "Nước ép dưa hấu", "DangBan" }
                });

            migrationBuilder.InsertData(
                table: "NguyenLieus",
                columns: new[] { "MaNL", "DonGia", "DonViTinh", "GiaTriTon", "SoLuongTon", "TenNL" },
                values: new object[,]
                {
                    { "NL01", 0f, "Kg", 0f, 0f, "Thịt Bò Úc" },
                    { "NL02", 0f, "Kg", 0f, 0f, "Cà chua Đà Lạt" },
                    { "NL03", 0f, "Thùng", 0f, 0f, "Bia Heineken" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "KhuyenMais",
                keyColumn: "MaKM",
                keyValue: "CHAO_PHONG");

            migrationBuilder.DeleteData(
                table: "KhuyenMais",
                keyColumn: "MaKM",
                keyValue: "KHAITRUONG");

            migrationBuilder.DeleteData(
                table: "MonAns",
                keyColumn: "MaMon",
                keyValue: "M01");

            migrationBuilder.DeleteData(
                table: "MonAns",
                keyColumn: "MaMon",
                keyValue: "M02");

            migrationBuilder.DeleteData(
                table: "MonAns",
                keyColumn: "MaMon",
                keyValue: "M03");

            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL01");

            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL02");

            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL03");
        }
    }
}
