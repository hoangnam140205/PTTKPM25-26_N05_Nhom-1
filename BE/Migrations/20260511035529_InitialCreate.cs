using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bans",
                columns: table => new
                {
                    MaBan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bans", x => x.MaBan);
                });

            migrationBuilder.CreateTable(
                name: "KhachHangs",
                columns: table => new
                {
                    SoDienThoai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachHangs", x => x.SoDienThoai);
                });

            migrationBuilder.CreateTable(
                name: "KhuyenMais",
                columns: table => new
                {
                    MaKM = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PhanTramGiam = table.Column<float>(type: "real", nullable: false),
                    HanSuDung = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhuyenMais", x => x.MaKM);
                });

            migrationBuilder.CreateTable(
                name: "MonAns",
                columns: table => new
                {
                    MaMon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenMon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaTien = table.Column<float>(type: "real", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonAns", x => x.MaMon);
                });

            migrationBuilder.CreateTable(
                name: "NhanViens",
                columns: table => new
                {
                    MaNV = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhanViens", x => x.MaNV);
                });

            migrationBuilder.CreateTable(
                name: "HoaDons",
                columns: table => new
                {
                    MaHD = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TongTien = table.Column<float>(type: "real", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KhachHangSoDienThoai = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaBan = table.Column<int>(type: "int", nullable: true),
                    ThuNganMaNV = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    KhuyenMaiMaKM = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDons", x => x.MaHD);
                    table.ForeignKey(
                        name: "FK_HoaDons_Bans_MaBan",
                        column: x => x.MaBan,
                        principalTable: "Bans",
                        principalColumn: "MaBan");
                    table.ForeignKey(
                        name: "FK_HoaDons_KhachHangs_KhachHangSoDienThoai",
                        column: x => x.KhachHangSoDienThoai,
                        principalTable: "KhachHangs",
                        principalColumn: "SoDienThoai",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HoaDons_KhuyenMais_KhuyenMaiMaKM",
                        column: x => x.KhuyenMaiMaKM,
                        principalTable: "KhuyenMais",
                        principalColumn: "MaKM",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HoaDons_NhanViens_ThuNganMaNV",
                        column: x => x.ThuNganMaNV,
                        principalTable: "NhanViens",
                        principalColumn: "MaNV",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietHoaDons",
                columns: table => new
                {
                    MaHD = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaMon = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    ThanhTien = table.Column<float>(type: "real", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietHoaDons", x => new { x.MaHD, x.MaMon });
                    table.ForeignKey(
                        name: "FK_ChiTietHoaDons_HoaDons_MaHD",
                        column: x => x.MaHD,
                        principalTable: "HoaDons",
                        principalColumn: "MaHD",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietHoaDons_MonAns_MaMon",
                        column: x => x.MaMon,
                        principalTable: "MonAns",
                        principalColumn: "MaMon",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietHoaDons_MaMon",
                table: "ChiTietHoaDons",
                column: "MaMon");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_KhachHangSoDienThoai",
                table: "HoaDons",
                column: "KhachHangSoDienThoai");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_KhuyenMaiMaKM",
                table: "HoaDons",
                column: "KhuyenMaiMaKM");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_MaBan",
                table: "HoaDons",
                column: "MaBan");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_ThuNganMaNV",
                table: "HoaDons",
                column: "ThuNganMaNV");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietHoaDons");

            migrationBuilder.DropTable(
                name: "HoaDons");

            migrationBuilder.DropTable(
                name: "MonAns");

            migrationBuilder.DropTable(
                name: "Bans");

            migrationBuilder.DropTable(
                name: "KhachHangs");

            migrationBuilder.DropTable(
                name: "KhuyenMais");

            migrationBuilder.DropTable(
                name: "NhanViens");
        }
    }
}
