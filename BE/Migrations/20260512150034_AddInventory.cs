using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BE.Migrations
{
    /// <inheritdoc />
    public partial class AddInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NguyenLieus",
                columns: table => new
                {
                    MaNL = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenNL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SoLuongTon = table.Column<float>(type: "real", nullable: false),
                    DonViTinh = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguyenLieus", x => x.MaNL);
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhaps",
                columns: table => new
                {
                    MaPN = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NgayNhap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TongTien = table.Column<float>(type: "real", nullable: false),
                    NguoiNhap = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhaps", x => x.MaPN);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhaps",
                columns: table => new
                {
                    MaPN = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MaNL = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SoLuong = table.Column<float>(type: "real", nullable: false),
                    DonGia = table.Column<float>(type: "real", nullable: false),
                    ThanhTien = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuNhaps", x => new { x.MaPN, x.MaNL });
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhaps_NguyenLieus_MaNL",
                        column: x => x.MaNL,
                        principalTable: "NguyenLieus",
                        principalColumn: "MaNL",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhaps_PhieuNhaps_MaPN",
                        column: x => x.MaPN,
                        principalTable: "PhieuNhaps",
                        principalColumn: "MaPN",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhaps_MaNL",
                table: "ChiTietPhieuNhaps",
                column: "MaNL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhaps");

            migrationBuilder.DropTable(
                name: "NguyenLieus");

            migrationBuilder.DropTable(
                name: "PhieuNhaps");
        }
    }
}
