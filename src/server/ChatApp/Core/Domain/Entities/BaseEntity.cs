namespace ChatApp.Core.Domain.Entities
{
    public class BaseEntity<TKey>
    {
        public TKey Id { get; set; }
    }

    public class AuditableEntity<TKey> : BaseEntity<TKey>, IHasCreatedDate, IHasUpdatedDate
    {
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }
    }

    public interface IHasCreatedDate
    {
        DateTime CreatedDate { get; set; }
    }

    public interface IHasUpdatedDate
    {
        DateTime? UpdatedDate { get; set; }
    }

    public interface IHasSoftDelete
    {
        bool IsValid { get; set; }
    }
}
