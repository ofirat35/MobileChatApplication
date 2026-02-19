using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class addswipestatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLike",
                table: "Swipes");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Swipes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Swipes");

            migrationBuilder.AddColumn<bool>(
                name: "IsLike",
                table: "Swipes",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
