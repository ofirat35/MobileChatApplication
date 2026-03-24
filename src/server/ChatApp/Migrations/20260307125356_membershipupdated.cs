using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class membershipupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MembershipType",
                table: "Memberships");

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
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsValid = table.Column<bool>(type: "bit", nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "MembershipId",
                table: "Memberships");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Memberships");

            migrationBuilder.AddColumn<string>(
                name: "MembershipType",
                table: "Memberships",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
