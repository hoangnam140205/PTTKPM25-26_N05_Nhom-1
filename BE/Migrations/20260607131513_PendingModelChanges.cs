using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE.Migrations
{
    /// <inheritdoc />
    public partial class PendingModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDons_KhachHangs_KhachHangSoDienThoai",
                table: "HoaDons");

            migrationBuilder.DropForeignKey(
                name: "FK_HoaDons_KhuyenMais_KhuyenMaiMaKM",
                table: "HoaDons");

            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL04");

            migrationBuilder.AlterColumn<string>(
                name: "ThuNganMaNV",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "KhuyenMaiMaKM",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "KhachHangSoDienThoai",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "GhiChu",
                table: "ChiTietHoaDons",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 4,
                column: "TenBan",
                value: "Bàn số 4");

            migrationBuilder.InsertData(
                table: "Bans",
                columns: new[] { "MaBan", "TenBan", "TrangThai" },
                values: new object[] { 5, "Bàn số 5", "Trong" });

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

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDons_KhachHangs_KhachHangSoDienThoai",
                table: "HoaDons",
                column: "KhachHangSoDienThoai",
                principalTable: "KhachHangs",
                principalColumn: "SoDienThoai");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDons_KhuyenMais_KhuyenMaiMaKM",
                table: "HoaDons",
                column: "KhuyenMaiMaKM",
                principalTable: "KhuyenMais",
                principalColumn: "MaKM");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDons_KhachHangs_KhachHangSoDienThoai",
                table: "HoaDons");

            migrationBuilder.DropForeignKey(
                name: "FK_HoaDons_KhuyenMais_KhuyenMaiMaKM",
                table: "HoaDons");

            migrationBuilder.DeleteData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "NguyenLieus",
                keyColumn: "MaNL",
                keyValue: "NL01");

            migrationBuilder.AlterColumn<string>(
                name: "ThuNganMaNV",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "KhuyenMaiMaKM",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "KhachHangSoDienThoai",
                table: "HoaDons",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GhiChu",
                table: "ChiTietHoaDons",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Bans",
                keyColumn: "MaBan",
                keyValue: 4,
                column: "TenBan",
                value: "Bàn VIP 1");

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

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDons_KhachHangs_KhachHangSoDienThoai",
                table: "HoaDons",
                column: "KhachHangSoDienThoai",
                principalTable: "KhachHangs",
                principalColumn: "SoDienThoai",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDons_KhuyenMais_KhuyenMaiMaKM",
                table: "HoaDons",
                column: "KhuyenMaiMaKM",
                principalTable: "KhuyenMais",
                principalColumn: "MaKM",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
