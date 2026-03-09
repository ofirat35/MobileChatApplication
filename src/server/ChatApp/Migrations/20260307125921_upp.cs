using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class upp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Memberships_Membership_MembershipId",
                table: "Memberships");

            migrationBuilder.DropTable(
                name: "Membership");

            migrationBuilder.DropIndex(
                name: "IX_Memberships_MembershipId",
                table: "Memberships");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Memberships");

            migrationBuilder.DropColumn(
                name: "MembershipId",
                table: "Memberships");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Memberships");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Memberships",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Memberships",
                newName: "CreateDate");

            migrationBuilder.RenameColumn(
                name: "MembershipEnded",
                table: "Memberships",
                newName: "IsValid");

            migrationBuilder.CreateTable(
                name: "UserMemberships",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalAmount = table.Column<float>(type: "real", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MembershipEnded = table.Column<bool>(type: "bit", nullable: false),
                    MembershipId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserMemberships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserMemberships_Memberships_MembershipId",
                        column: x => x.MembershipId,
                        principalTable: "Memberships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserMemberships_MembershipId",
                table: "UserMemberships",
                column: "MembershipId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserMemberships");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Memberships",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "IsValid",
                table: "Memberships",
                newName: "MembershipEnded");

            migrationBuilder.RenameColumn(
                name: "CreateDate",
                table: "Memberships",
                newName: "StartDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Memberships",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "MembershipId",
                table: "Memberships",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<float>(
                name: "TotalAmount",
                table: "Memberships",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.CreateTable(
                name: "Membership",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsValid = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Membership", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_MembershipId",
                table: "Memberships",
                column: "MembershipId");

            migrationBuilder.AddForeignKey(
                name: "FK_Memberships_Membership_MembershipId",
                table: "Memberships",
                column: "MembershipId",
                principalTable: "Membership",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
